import { create } from 'zustand'

import type { CameraRecording } from '../types/recording.types'

type RecordingPlaybackStore = {
	selectedRecording: CameraRecording | null
	setSelectedRecording: (recording: CameraRecording) => void
	clearSelectedRecording: () => void
}

export const recordingPlaybackStore = create<RecordingPlaybackStore>()(set => ({
	selectedRecording: null,
	setSelectedRecording: selectedRecording => set({ selectedRecording }),
	clearSelectedRecording: () => set({ selectedRecording: null }),
}))
