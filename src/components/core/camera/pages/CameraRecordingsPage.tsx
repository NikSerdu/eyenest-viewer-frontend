import { Button, Flex, Heading } from '@chakra-ui/react'
import type { FC } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { CameraRecordingsWidget } from '../widgets'

export const CameraRecordingsPage: FC = () => {
	const { cameraId } = useParams<{ cameraId: string }>()
	const navigate = useNavigate()

	if (!cameraId) {
		return <Navigate to='/' />
	}

	return (
		<Flex direction='column' gap={6}>
			<Flex justify='space-between' align='center' wrap='wrap' gap={3}>
				<Heading size='lg'>Записи с камеры</Heading>
				<Button variant='outline' onClick={() => navigate(`/${cameraId}`)}>
					Назад к камере
				</Button>
			</Flex>

			<CameraRecordingsWidget cameraId={cameraId} />
		</Flex>
	)
}
