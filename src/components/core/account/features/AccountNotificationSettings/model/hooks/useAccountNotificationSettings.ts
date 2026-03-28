import { useEffect, useMemo, useReducer, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { UpdateUserNotificationSettingsRequest } from '@/api/generated'
import {
	useGetLinkTelegramToken,
	useGetUser,
	useGetUserNotificationSettings,
	useUnlinkTelegramAccount,
	useUpdateUserNotificationSettings,
} from '@/api/hooks'

/** Совпадает с TTL токена в notification-service (Redis EX 300). */
const TELEGRAM_LINK_TOKEN_TTL_MS = 5 * 60 * 1000

function formatMmSs(totalSeconds: number): string {
	const s = Math.max(0, Math.ceil(totalSeconds))
	const m = Math.floor(s / 60)
	const sec = s % 60
	return `${m}:${sec.toString().padStart(2, '0')}`
}

export const useAccountNotificationSettings = () => {
	const [copied, setCopied] = useState(false)
	const [unlinkError, setUnlinkError] = useState<string | null>(null)
	const [localSettings, setLocalSettings] =
		useState<UpdateUserNotificationSettingsRequest | null>(null)

	const queryClient = useQueryClient()
	const { isLoading: isUserLoading, isError: isUserError } = useGetUser()
	const {
		data: notificationSettings,
		isLoading: isSettingsLoading,
		isError: isSettingsError,
	} = useGetUserNotificationSettings()
	const [tickCount, bumpTick] = useReducer((n: number) => n + 1, 0)

	const {
		data: linkTelegramTokenData,
		refetch: refetchLinkTelegramToken,
		isFetching: isLinkTokenLoading,
		dataUpdatedAt: linkTokenDataUpdatedAt,
	} = useGetLinkTelegramToken({ enabled: false })

	useEffect(() => {
		const token = linkTelegramTokenData?.token
		if (!token || !linkTokenDataUpdatedAt) return

		bumpTick()
		let id: ReturnType<typeof setInterval>
		id = window.setInterval(() => {
			bumpTick()
			if (Date.now() - linkTokenDataUpdatedAt >= TELEGRAM_LINK_TOKEN_TTL_MS) {
				clearInterval(id)
			}
		}, 1000)

		return () => clearInterval(id)
	}, [linkTelegramTokenData?.token, linkTokenDataUpdatedAt])

	const linkTokenExpiry = useMemo(() => {
		const token = linkTelegramTokenData?.token
		if (!token || !linkTokenDataUpdatedAt) {
			return null
		}
		const expiresAt = linkTokenDataUpdatedAt + TELEGRAM_LINK_TOKEN_TTL_MS
		const remainingMs = Math.max(0, expiresAt - Date.now())
		const progressPercent = (remainingMs / TELEGRAM_LINK_TOKEN_TTL_MS) * 100
		const expired = remainingMs <= 0
		return {
			remainingMs,
			progressPercent,
			expired,
			label: formatMmSs(remainingMs / 1000),
		}
	}, [linkTelegramTokenData?.token, linkTokenDataUpdatedAt, tickCount])

	const effectiveSettings = localSettings ?? notificationSettings ?? null

	const { mutate, isPending } = useUpdateUserNotificationSettings({
		onSuccess: data => {
			queryClient.setQueryData(['get user notification settings'], data)
			setLocalSettings({
				emailEnabled: data.emailEnabled,
				telegramEnabled: data.telegramEnabled,
			})
		},
		onError: () => {
			if (!notificationSettings) {
				return
			}
			setLocalSettings({
				emailEnabled: notificationSettings.emailEnabled,
				telegramEnabled: notificationSettings.telegramEnabled,
			})
		},
	})

	const { mutate: unlinkTelegram, isPending: isUnlinkPending } =
		useUnlinkTelegramAccount({
			onMutate: () => {
				setUnlinkError(null)
			},
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: ['get user notification settings'],
				})
			},
			onError: () => {
				setUnlinkError('Не удалось отвязать Telegram. Попробуйте позже.')
			},
		})

	const canControl =
		!isPending && !isSettingsLoading && Boolean(effectiveSettings)
	const isSettingsBlockLoading = isUserLoading || isSettingsLoading
	const hasLinkedTelegram = Boolean(
		notificationSettings?.telegramChatId?.trim(),
	)

	const toggleSetting = (
		key: keyof UpdateUserNotificationSettingsRequest,
		nextValue: boolean,
	) => {
		if (!effectiveSettings) {
			return
		}
		const nextPayload: UpdateUserNotificationSettingsRequest = {
			emailEnabled: effectiveSettings.emailEnabled,
			telegramEnabled: effectiveSettings.telegramEnabled,
			[key]: nextValue,
		}
		setLocalSettings(nextPayload)
		mutate(nextPayload)
	}

	const copyLinkToken = () => {
		const token = linkTelegramTokenData?.token
		if (!token) return
		navigator.clipboard.writeText(token)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return {
		notificationSettings,
		effectiveSettings,
		linkTelegramTokenData,
		linkTokenExpiry,
		copied,
		unlinkError,
		canControl,
		isSettingsBlockLoading,
		isUserError,
		isSettingsError,
		hasLinkedTelegram,
		isLinkTokenLoading,
		isUnlinkPending,
		toggleSetting,
		refetchLinkTelegramToken,
		copyLinkToken,
		unlinkTelegram,
	}
}
