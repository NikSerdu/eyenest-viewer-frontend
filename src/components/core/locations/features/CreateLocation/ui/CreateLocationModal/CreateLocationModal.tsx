import type { FC } from 'react'
import {
	Box,
	Button,
	Flex,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateLocation } from '@/api/hooks/camera/camera.hooks'
import { useQueryClient } from '@tanstack/react-query'
import {
	createLocationSchema,
	type CreateLocationFormValues,
} from '../../model/schemas/createLocation.schema'

interface CreateLocationModalProps {
	isOpen: boolean
	onClose: () => void
}

export const CreateLocationModal: FC<CreateLocationModalProps> = ({
	isOpen,
	onClose,
}) => {
	const queryClient = useQueryClient()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<CreateLocationFormValues>({
		resolver: zodResolver(createLocationSchema),
		defaultValues: {
			name: '',
		},
	})

	const { mutateAsync: createLocation } = useCreateLocation({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['get locations'] })
		},
	})

	const onSubmit = async (values: CreateLocationFormValues) => {
		await createLocation({
			name: values.name,
		})
		reset()
		onClose()
	}

	if (!isOpen) return null

	return (
		<>
			<Box
				position='fixed'
				inset={0}
				bg='blackAlpha.400'
				backdropFilter='blur(6px)'
				zIndex={40}
				onClick={onClose}
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
					<Text fontSize='lg' fontWeight='semibold' color='gray.900'>
						Новая локация
					</Text>
					<Button
						variant='ghost'
						onClick={onClose}
						size='sm'
						minW='auto'
						h={9}
						w={9}
					>
						<X className='w-5 h-5 text-slate-600' />
					</Button>
				</Flex>

				<Stack
					as='form'
					onSubmit={handleSubmit(onSubmit)}
					spacing={4}
				>
					<Box>
						<Text
							as='label'
							display='block'
							fontSize='sm'
							color='gray.700'
							mb={2}
						>
							Название локации
						</Text>
						<Input
							placeholder='Например, Здание C'
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
						onClick={onClose}
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

