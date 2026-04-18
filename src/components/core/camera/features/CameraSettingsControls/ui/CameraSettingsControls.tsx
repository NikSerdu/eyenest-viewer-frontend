import {
	Box,
	Flex,
	Heading,
	Spinner,
	Stack,
	Switch,
	Text,
} from '@chakra-ui/react'
import { Settings2 } from 'lucide-react'
import type { FC } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useGetCameraById, useUpdateCameraSettings } from '@/api/hooks'

interface CameraSettingsControlsProps {
	cameraId: string
}

const toStatus = (enabled: boolean) => (enabled ? 'ON' : 'OFF')

export const CameraSettingsControls: FC<CameraSettingsControlsProps> = ({
	cameraId,
}) => {
	const queryClient = useQueryClient()
	const { data, isLoading, isError, refetch } = useGetCameraById(cameraId)
	const { mutate, isPending } = useUpdateCameraSettings({
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [`get camera by id ${cameraId}`],
			})
			queryClient.invalidateQueries({
				queryKey: ['get all recordings', cameraId],
			})
		},
	})

	const cameraName = data?.name ?? 'Камера'
	const settings = data?.cameraSettings
	const aiEnabled = settings?.aiStatus === 'ON'
	const recordingEnabled = settings?.recordingStatus === 'ON'
	const canControl = Boolean(settings) && !isPending && !isLoading

	const handleSettingsChange = (
		nextAiEnabled: boolean,
		nextRecordingEnabled: boolean,
	) => {
		mutate(
			{
				cameraId,
				aiStatus: toStatus(nextAiEnabled),
				recordingStatus: toStatus(nextRecordingEnabled),
			},
			{
				onError: () => {
					void refetch()
				},
			},
		)
	}

	return (
		<Box
			borderRadius='xl'
			bg='whiteAlpha.700'
			backdropFilter='blur(12px)'
			borderWidth='1px'
			borderColor='gray.200'
			boxShadow='md'
			p={{ base: 3, md: 4 }}
		>
			<Stack gap={3}>
				<Flex justify='space-between' align='center' gap={3} wrap='wrap'>
					<Flex align='center' gap={2.5}>
						<Box
							boxSize={8}
							borderRadius='lg'
							bgGradient='to-br'
							gradientFrom='brand.blue.500'
							gradientTo='brand.blue.700'
							display='flex'
							alignItems='center'
							justifyContent='center'
							color='white'
							boxShadow='sm'
						>
							<Settings2 size={14} />
						</Box>
						<Box>
							<Heading size='xs'>Настройки камеры</Heading>
							<Text fontSize='xs' color='gray.600'>
								{cameraName}
							</Text>
						</Box>
					</Flex>
				</Flex>

				{isLoading && (
					<Flex align='center' gap={3}>
						<Spinner size='sm' color='brand.blue.500' />
						<Text fontSize='sm' color='gray.600'>
							Загрузка настроек...
						</Text>
					</Flex>
				)}

				{isError && (
					<Flex
						align='center'
						justify='space-between'
						gap={3}
						p={3}
						borderRadius='lg'
						bg='red.50'
						borderWidth='1px'
						borderColor='red.200'
					>
						<Text fontSize='sm' color='red.600'>
							Не удалось загрузить настройки камеры.
						</Text>
						<Text
							as='button'
							fontSize='sm'
							fontWeight='semibold'
							color='red.600'
							_hover={{ textDecoration: 'underline' }}
							onClick={() => void refetch()}
						>
							Повторить
						</Text>
					</Flex>
				)}

				{!isLoading && !isError && !settings && (
					<Box
						p={3}
						borderRadius='lg'
						bg='gray.50'
						borderWidth='1px'
						borderColor='gray.200'
					>
						<Text fontSize='sm' color='gray.600'>
							Настройки для этой камеры пока недоступны.
						</Text>
					</Box>
				)}

				{settings && (
					<Stack
						gap={2}
						borderWidth='1px'
						borderColor='gray.100'
						borderRadius='lg'
						bg='whiteAlpha.500'
						p={3}
					>
						<Flex justify='space-between' align='center' gap={3} wrap='wrap'>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' color='gray.800'>
									Детекция
								</Text>
								<Text fontSize='xs' color='gray.600'>
									Определение движения и событий на видео
								</Text>
							</Box>
							<Switch.Root
								checked={aiEnabled}
								disabled={!canControl}
								onCheckedChange={({ checked }) =>
									handleSettingsChange(checked, recordingEnabled)
								}
								colorPalette='blue'
							>
								<Switch.HiddenInput />
								<Switch.Control />
							</Switch.Root>
						</Flex>

						<Flex justify='space-between' align='center' gap={3} wrap='wrap'>
							<Box>
								<Text fontSize='sm' fontWeight='semibold' color='gray.800'>
									Запись
								</Text>
								<Text fontSize='xs' color='gray.600'>
									Сохранять видео в историю записей
								</Text>
							</Box>
							<Switch.Root
								checked={recordingEnabled}
								disabled={!canControl}
								onCheckedChange={({ checked }) =>
									handleSettingsChange(aiEnabled, checked)
								}
								colorPalette='blue'
							>
								<Switch.HiddenInput />
								<Switch.Control />
							</Switch.Root>
						</Flex>
					</Stack>
				)}
			</Stack>
		</Box>
	)
}
