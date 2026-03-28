import type { EventResponse } from '@api/generated'

import type { CameraRecording } from '@/components/core/camera/entities'

/** События, которые показываем на шкале как «движение» */
export const TIMELINE_MOTION_EVENT_TYPES = new Set(['MOTION_DETECTED'])

export function startOfLocalDay(d: Date): Date {
	const x = new Date(d)
	x.setHours(0, 0, 0, 0)
	return x
}

export function endOfLocalDay(d: Date): Date {
	const x = new Date(d)
	x.setHours(23, 59, 59, 999)
	return x
}

export function localDayKey(d: Date): string {
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')
	return `${y}-${m}-${day}`
}

export function parseLocalDayKey(ymd: string): Date {
	const [y, mo, da] = ymd.split('-').map(Number)
	return new Date(y, mo - 1, da)
}

export function recordingEndMs(r: CameraRecording): number {
	if (r.status === 0) {
		return Date.now()
	}
	const t = new Date(r.finishedAt).getTime()
	return Number.isNaN(t) ? Date.now() : t
}

export type DayTimelineSegment = {
	recordingId: string
	leftPct: number
	widthPct: number
	hasMotion: boolean
}

export type DayTimelineMotionMarker = {
	id: string
	leftPct: number
	createdAtMs: number
}

const MIN_VIEW_SPAN_MS = 5 * 60 * 1000

/** Событие попадает в момент, который есть в записи (по суткам камеры) */
function isMsWithinRecordingIntervals(
	t: number,
	intervals: { start: number; end: number }[],
): boolean {
	return intervals.some(iv => t >= iv.start && t <= iv.end)
}

function computeAdaptiveViewBounds(
	dayStart: number,
	dayEnd: number,
	intervals: { start: number; end: number }[],
): { viewStartMs: number; viewEndMs: number; isFullDayFallback: boolean } {
	if (intervals.length === 0) {
		return {
			viewStartMs: dayStart,
			viewEndMs: dayEnd,
			isFullDayFallback: true,
		}
	}

	let contentStart = Number.POSITIVE_INFINITY
	let contentEnd = Number.NEGATIVE_INFINITY

	for (const iv of intervals) {
		contentStart = Math.min(contentStart, iv.start)
		contentEnd = Math.max(contentEnd, iv.end)
	}

	const rawSpan = Math.max(1, contentEnd - contentStart)
	const padMs = Math.max(60_000, rawSpan * 0.06)

	let viewStartMs = Math.max(dayStart, contentStart - padMs)
	let viewEndMs = Math.min(dayEnd, contentEnd + padMs)

	if (viewEndMs - viewStartMs < MIN_VIEW_SPAN_MS) {
		const c = (viewStartMs + viewEndMs) / 2
		viewStartMs = Math.max(dayStart, c - MIN_VIEW_SPAN_MS / 2)
		viewEndMs = Math.min(dayEnd, c + MIN_VIEW_SPAN_MS / 2)
	}

	return {
		viewStartMs,
		viewEndMs,
		isFullDayFallback: false,
	}
}

/** Равномерные подписи времени по краям видимого окна (реальные часы) */
export function buildViewTickLabels(
	viewStartMs: number,
	viewEndMs: number,
	tickCount = 5,
): string[] {
	const span = viewEndMs - viewStartMs
	if (span <= 0 || tickCount < 2) {
		return [formatWallClockShort(viewStartMs)]
	}
	const labels: string[] = []
	for (let i = 0; i < tickCount; i++) {
		const t = viewStartMs + (i / (tickCount - 1)) * span
		labels.push(formatWallClockShort(t))
	}
	return labels
}

export function formatWallClockShort(ms: number): string {
	const d = new Date(ms)
	return d.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})
}

export function formatWallClockRange(
	viewStartMs: number,
	viewEndMs: number,
): string {
	return `${formatWallClockShort(viewStartMs)} — ${formatWallClockShort(viewEndMs)}`
}

export type DayTimelineBuildOptions = {
	/** События в этих интервалах настенного времени не учитываются (маркеры и подсветка движения) */
	excludeEventWallRangesMs?: { start: number; end: number }[]
}

export function isWallTimeExcludedFromRanges(
	t: number,
	ranges: { start: number; end: number }[] | undefined,
): boolean {
	if (!ranges?.length) {
		return false
	}
	return ranges.some(r => t >= r.start && t <= r.end)
}

export function buildDayTimelineModel(
	recordings: CameraRecording[],
	events: EventResponse[],
	selectedDay: Date,
	options?: DayTimelineBuildOptions,
): {
	calendarDayStartMs: number
	calendarDayEndMs: number
	viewStartMs: number
	viewEndMs: number
	viewSpanMs: number
	isFullDayFallback: boolean
	segments: DayTimelineSegment[]
	motionMarkers: DayTimelineMotionMarker[]
} {
	const dayStart = startOfLocalDay(selectedDay).getTime()
	const dayEnd = endOfLocalDay(selectedDay).getTime()

	const intervals: { start: number; end: number }[] = []
	for (const r of recordings) {
		const recStart = new Date(r.createdAt).getTime()
		const recEnd = recordingEndMs(r)
		const segStart = Math.max(recStart, dayStart)
		const segEnd = Math.min(recEnd, dayEnd)
		if (segStart < segEnd) {
			intervals.push({ start: segStart, end: segEnd })
		}
	}

	const { viewStartMs, viewEndMs, isFullDayFallback } = computeAdaptiveViewBounds(
		dayStart,
		dayEnd,
		intervals,
	)

	const viewSpanMs = Math.max(1, viewEndMs - viewStartMs)

	const segments: DayTimelineSegment[] = []

	for (const r of recordings) {
		const recStart = new Date(r.createdAt).getTime()
		const recEnd = recordingEndMs(r)
		const segStart = Math.max(recStart, dayStart)
		const segEnd = Math.min(recEnd, dayEnd)
		if (segStart >= segEnd) {
			continue
		}
		const drawStart = Math.max(segStart, viewStartMs)
		const drawEnd = Math.min(segEnd, viewEndMs)
		if (drawStart >= drawEnd) {
			continue
		}
		const hasMotion = events.some(e => {
			if (!TIMELINE_MOTION_EVENT_TYPES.has(e.eventType)) {
				return false
			}
			const et = new Date(e.createdAt).getTime()
			if (isWallTimeExcludedFromRanges(et, options?.excludeEventWallRangesMs)) {
				return false
			}
			return et >= segStart && et <= segEnd
		})
		segments.push({
			recordingId: r.id,
			leftPct: ((drawStart - viewStartMs) / viewSpanMs) * 100,
			widthPct: ((drawEnd - drawStart) / viewSpanMs) * 100,
			hasMotion,
		})
	}

	const motionMarkers: DayTimelineMotionMarker[] = events
		.filter(
			e =>
				TIMELINE_MOTION_EVENT_TYPES.has(e.eventType) &&
				isEventOnLocalDay(e.createdAt, selectedDay),
		)
		.map(e => {
			const et = new Date(e.createdAt).getTime()
			return { id: e.id, et }
		})
		.filter(({ et }) => isMsWithinRecordingIntervals(et, intervals))
		.filter(({ et }) =>
			!isWallTimeExcludedFromRanges(et, options?.excludeEventWallRangesMs),
		)
		.filter(({ et }) => et >= viewStartMs && et <= viewEndMs)
		.map(({ id, et }) => ({
			id,
			leftPct: ((et - viewStartMs) / viewSpanMs) * 100,
			createdAtMs: et,
		}))

	return {
		calendarDayStartMs: dayStart,
		calendarDayEndMs: dayEnd,
		viewStartMs,
		viewEndMs,
		viewSpanMs,
		isFullDayFallback,
		segments,
		motionMarkers,
	}
}

function isEventOnLocalDay(iso: string, day: Date): boolean {
	const t = new Date(iso).getTime()
	const ds = startOfLocalDay(day).getTime()
	const de = endOfLocalDay(day).getTime()
	return t >= ds && t <= de
}
