import { useCallback, useState } from 'react'

interface UseAudioControlsResult {
	isMuted: boolean
	volume: number
	toggleMute: () => void
	handleVolumeChange: (value: number) => void
}

export const useAudioControls = (): UseAudioControlsResult => {
	const [isMuted, setIsMuted] = useState(false)
	const [volume, setVolume] = useState(1)

	const toggleMute = useCallback(() => {
		setIsMuted(prev => !prev)
	}, [])

	const handleVolumeChange = useCallback(
		(value: number) => {
			const normalized = Math.min(100, Math.max(0, value)) / 100
			setVolume(normalized)

			if (normalized > 0 && isMuted) {
				setIsMuted(false)
			}
		},
		[isMuted],
	)

	return {
		isMuted,
		volume,
		toggleMute,
		handleVolumeChange,
	}
}

