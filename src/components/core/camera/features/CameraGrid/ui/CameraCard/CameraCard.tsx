import { useState } from 'react'
import { AlertCircle, Radio } from 'lucide-react'
import { Box, Flex, Stack, Badge, Text } from '@chakra-ui/react'
import type { CameraResponse } from '@/api/generated'
import { CameraVideo } from '../../../CameraVideo/ui/CameraVideo'
import { useNavigate } from 'react-router-dom'

interface CameraCardProps {
	camera: CameraResponse
	isExpanded: boolean
}
type Status = 'online' | 'offline'
export const CameraCard = ({ camera }: CameraCardProps) => {
	const [isRecording, setIsRecording] = useState(true)
	const [aiMotionEnabled, setAiMotionEnabled] = useState(true)
	const [status] = useState<Status>('online')
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
			aspectRatio='16 / 9'
			onClick={() => nav(camera.id)}
		>
			<CameraVideo roomID={camera.id} />

			{/* Усиленный градиент для лучшей читаемости текста */}
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
				top={4}
				left={4}
				right={4}
				justify='space-between'
				align='flex-start'
				zIndex={1}
			>
				<Stack direction='row' gap={2}>
					<Badge colorScheme={status === 'online' ? 'green' : 'red'}>
						<Flex align='center' gap={2}>
							<Box
								boxSize='8px'
								borderRadius='full'
								bg={status === 'online' ? 'green.400' : 'red.400'}
							/>
							<Text fontSize='xs' textTransform='uppercase'>
								{status === 'online' ? 'В сети' : 'Не в сети'}
							</Text>
						</Flex>
					</Badge>

					{isRecording && status === 'online' && (
						<Badge colorScheme='red'>
							<Flex align='center' gap={2}>
								<Radio size={14} />
								<Text fontSize='xs' textTransform='uppercase'>
									Запись
								</Text>
							</Flex>
						</Badge>
					)}

					{aiMotionEnabled && (
						<Badge colorScheme='yellow'>
							<Flex align='center' gap={2}>
								<AlertCircle size={14} />
								<Text fontSize='xs' textTransform='uppercase'>
									AI детекция
								</Text>
							</Flex>
						</Badge>
					)}
				</Stack>
			</Flex>

			{status === 'offline' && (
				<Flex
					position='absolute'
					top={0}
					left={0}
					right={0}
					bottom={0}
					align='center'
					justify='center'
					zIndex={1}
				>
					<Stack textAlign='center' color='white'>
						<AlertCircle size={48} />
						<Text>Камера не в сети</Text>
						<Text fontSize='sm'>Попытка переподключения...</Text>
					</Stack>
				</Flex>
			)}

			{/* Текст с дополнительным фоном для лучшей читаемости */}
			<Box position='absolute' bottom={4} left={4} right={4} zIndex={1}>
				<Flex justify='space-between' align='flex-end'>
					<Box
						bg='blackAlpha.700'
						px={3}
						py={2}
						borderRadius='lg'
						backdropFilter='blur(4px)'
					>
						<Text fontWeight='semibold' color='white'>
							{camera.id}
						</Text>
					</Box>
				</Flex>
			</Box>
		</Box>
	)
}
