import type { FC } from 'react'
import { Box, Button, Flex, Input, Stack, Text } from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddCamera } from '@/api/hooks/camera/camera.hooks'
import {
	addCameraSchema,
	type AddCameraFormValues,
} from '../../model/schemas/addCamera.schema'

interface AddCameraModalProps {
	isOpen: boolean
	locationId: string | null
	locationName?: string
	onSuccess: (params: { token: string; cameraName: string }) => void
	onClose: () => void
}

export const AddCameraModal: FC<AddCameraModalProps> = ({
	isOpen,
	locationId,
	locationName,
	onSuccess,
	onClose,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<AddCameraFormValues>({
		resolver: zodResolver(addCameraSchema),
		defaultValues: {
			name: '',
		},
	})

	const { mutateAsync: addCamera } = useAddCamera()

	const handleClose = () => {
		reset()
		onClose()
	}

	const onSubmit = async (values: AddCameraFormValues) => {
		if (!locationId) return
		const res = await addCamera({
			name: values.name,
			locationId,
		})
		onSuccess({ token: res.token, cameraName: values.name })
		reset()
		onClose()
	}

	if (!isOpen || !locationId) return null

	return (
		<>
			<Box
				position='fixed'
				inset={0}
				bg='blackAlpha.400'
				backdropFilter='blur(6px)'
				zIndex={40}
				onClick={handleClose}
			/>
			<Box
				position='fixed'
				insetX={0}
				top='50%'
				left={0}
				right={0}
				mx='auto'
				transform='translateY(-50%)'
				w={{ base: 'calc(100vw - 24px)', md: 'calc(100vw - 32px)' }}
				maxW='md'
				maxH='calc(100vh - 24px)'
				bg='white'
				rounded='2xl'
				boxShadow='2xl'
				zIndex={50}
				p={{ base: 4, md: 6 }}
				overflowY='auto'
			>
				<Flex align='center' justify='space-between' mb={4}>
					<Box>
						<Text fontSize='lg' fontWeight='semibold' color='gray.900' mb={1}>
							Новая камера
						</Text>
						{locationName && (
							<Text fontSize='sm' color='gray.600'>
								Локация: {locationName}
							</Text>
						)}
					</Box>
					<Button
						variant='ghost'
						onClick={handleClose}
						size='sm'
						minW='auto'
						h={9}
						w={9}
					>
						<X className='w-5 h-5 text-slate-600' />
					</Button>
				</Flex>

				<Stack as='form' onSubmit={handleSubmit(onSubmit)} gap={4}>
					<Box>
						<Text
							as='label'
							display='block'
							fontSize='sm'
							color='gray.700'
							mb={2}
						>
							Название камеры
						</Text>
						<Input
							placeholder='Например, Главный вход'
							bg='gray.50'
							borderColor='gray.200'
							_focusVisible={{
								borderColor: 'blue.500',
								boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
							}}
							{...register('name')}
						/>
						{errors.name && (
							<Text mt={1} fontSize='xs' color='red.500'>
								{errors.name.message}
							</Text>
						)}
					</Box>

				<Flex gap={3} pt={4} direction='row'>
					<Button
						onClick={handleClose}
						variant='outline'
						colorScheme='gray'
						h={11}
						flex={1}
					>
						Отмена
					</Button>
					<Button
						type='submit'
						h={11}
						flex={1}
						bgGradient='to-r'
						gradientFrom='brand.blue.500'
						gradientTo='brand.blue.700'
						color='white'
						_hover={{ boxShadow: 'lg' }}
						loading={isSubmitting}
					>
						Создать
					</Button>
				</Flex>
				</Stack>
			</Box>
		</>
	)
}
