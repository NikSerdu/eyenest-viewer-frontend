import { Box } from '@chakra-ui/react'
import type { FC } from 'react'

import { useHlsPlayback } from '../model/hooks/useHlsPlayback'

interface CameraHlsPlayerProps {
	playlistUrl: string
}

export const CameraHlsPlayer: FC<CameraHlsPlayerProps> = ({ playlistUrl }) => {
	const { videoRef } = useHlsPlayback(playlistUrl)

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
				ref={videoRef}
				controls
				autoPlay
				muted
				playsInline
				style={{ width: '100%', height: '100%', objectFit: 'contain' }}
			/>
		</Box>
	)
}
