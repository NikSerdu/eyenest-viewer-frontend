import { Box } from '@chakra-ui/react'
import type { FC } from 'react'

import { useHlsPlayback } from '../model/hooks/useHlsPlayback'

interface CameraHlsPlayerProps {
	playlistUrl: string
	onVideoElement?: (el: HTMLVideoElement | null) => void
}

export const CameraHlsPlayer: FC<CameraHlsPlayerProps> = ({
	playlistUrl,
	onVideoElement,
}) => {
	const { setVideoRef } = useHlsPlayback(playlistUrl, onVideoElement)

	return (
		<Box
			borderRadius='2xl'
			overflow='hidden'
			bg='black'
			borderWidth='1px'
			borderColor='gray.200'
			minH={{ base: '260px', md: '520px' }}
		>
			<video
				ref={setVideoRef}
				controls
				autoPlay
				muted
				playsInline
				style={{ width: '100%', height: '100%', objectFit: 'contain' }}
			/>
		</Box>
	)
}
