import { useState } from 'react'
import { AlertCircle, Radio } from 'lucide-react'
import { Box, Flex, Stack, Badge, Text } from '@chakra-ui/react'
import type { CameraResponse } from '@/api/generated'
import { useNavigate } from 'react-router-dom'
import { CameraVideoPreview } from './CameraVideoPreview/CameraVideoPreview'

interface CameraCardProps {
	camera: CameraResponse
	isExpanded: boolean
}
type Status = 'online' | 'offline'
export const CameraCard = ({ camera }: CameraCardProps) => {
	const [isRecording] = useState(
		camera.cameraSettings?.recordingStatus === 'ON',
	)
	const [aiMotionEnabled] = useState(camera.cameraSettings?.aiStatus === 'ON')
	const [status, setStatus] = useState<Status>('offline')
	const nav = useNavigate()
	return (
		<Box
			position='relative'
			borderRadius='2xl'
			overflow='hidden'
			bg='whiteAlpha.600'
			backdropFilter='blur(24px)'
			borderWidth='1px'
			borderColor='gray.200'
			boxShadow='xl'
			_hover={{ boxShadow: '2xl' }}
			aspectRatio={{ base: '16 / 10', md: '16 / 9' }}
			onClick={() => nav(camera.id)}
		>
			<CameraVideoPreview
				roomID={camera.id}
				onStatusChange={online => setStatus(online ? 'online' : 'offline')}
			/>

			<Box
				position='absolute'
				top={0}
				left={0}
				right={0}
				bottom={0}
				bgGradient='linear(to-t, blackAlpha.900 0%, blackAlpha.600 30%, transparent 50%, blackAlpha.600 70%, blackAlpha.900 100%)'
			/>

			<Flex
				position='absolute'
				top={{ base: 2, md: 4 }}
				left={{ base: 2, md: 4 }}
				right={{ base: 2, md: 4 }}
				justify='space-between'
				align='flex-start'
				zIndex={1}
			>
				<Stack direction='row' gap={2} flexWrap='wrap'>
					<Badge colorScheme={status === 'online' ? 'green' : 'red'}>
						<Flex align='center' gap={2}>
							<Box
								boxSize='8px'
								borderRadius='full'
								bg={status === 'online' ? 'green.400' : 'red.400'}
							/>
							<Text fontSize={{ base: '10px', md: 'xs' }} textTransform='uppercase'>
								{status === 'online' ? 'В сети' : 'Не в сети'}
							</Text>
						</Flex>
					</Badge>

					{isRecording && (
						<Badge colorScheme='red'>
							<Flex align='center' gap={2}>
								<Radio size={14} />
								<Text fontSize={{ base: '10px', md: 'xs' }} textTransform='uppercase'>
									Запись
								</Text>
							</Flex>
						</Badge>
					)}

					{aiMotionEnabled && (
						<Badge colorScheme='yellow'>
							<Flex align='center' gap={2}>
								<AlertCircle size={14} />
								<Text fontSize={{ base: '10px', md: 'xs' }} textTransform='uppercase'>
									Детекция
								</Text>
							</Flex>
						</Badge>
					)}
				</Stack>
			</Flex>

			<Box
				position='absolute'
				bottom={{ base: 2, md: 4 }}
				left={{ base: 2, md: 4 }}
				right={{ base: 2, md: 4 }}
				zIndex={1}
			>
				<Flex justify='space-between' align='flex-end'>
					<Box
						bg='blackAlpha.700'
						px={{ base: 2.5, md: 3 }}
						py={{ base: 1.5, md: 2 }}
						borderRadius='lg'
						backdropFilter='blur(4px)'
					>
						<Text fontWeight='semibold' color='white' fontSize={{ base: 'sm', md: 'md' }}>
							{camera.name}
						</Text>
					</Box>
				</Flex>
			</Box>
		</Box>
	)
}
