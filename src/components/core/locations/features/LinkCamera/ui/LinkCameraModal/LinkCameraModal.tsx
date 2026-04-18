import type { FC } from 'react'
import { useEffect, useState } from 'react'
import {
	Box,
	Button,
	Flex,
	Image,
	Stack,
	Text,
	useBreakpointValue,
} from '@chakra-ui/react'
import { Check, Copy, QrCode, X } from 'lucide-react'
import QRCode from 'qrcode'
import { useGetLinkCameraToken } from '@/api/hooks/camera/camera.hooks'

interface LinkCameraModalProps {
	isOpen: boolean
	cameraId: string | null
	token?: string
	cameraName?: string
	locationName?: string
	onClose: () => void
}

export const LinkCameraModal: FC<LinkCameraModalProps> = ({
	isOpen,
	cameraId,
	token: externalToken,
	cameraName,
	locationName,
	onClose,
}) => {
	const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
	const [copied, setCopied] = useState(false)

	const isMobile = useBreakpointValue({ base: true, md: false }) ?? true

	const { data, mutate, isPending } = useGetLinkCameraToken()

	useEffect(() => {
		if (isOpen && cameraId && !externalToken) {
			mutate({ cameraId })
		}
	}, [isOpen, cameraId, externalToken, mutate])

	useEffect(() => {
		const token = externalToken ?? data?.token
		if (!token) return

		QRCode.toDataURL(token, {
			width: 300,
			margin: 2,
			color: {
				dark: '#1e293b',
				light: '#ffffff',
			},
		})
			.then(url => {
				setQrCodeUrl(url)
			})
			.catch(err => {
				console.error('Error generating QR code:', err)
			})
	}, [data, externalToken])

	const handleCopy = () => {
		const token = externalToken ?? data?.token
		if (!token) return
		navigator.clipboard.writeText(token)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}
	if (!isOpen) return null
	if (!externalToken && !cameraId) return null

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
				insetX='auto'
				top={{ base: '12px', md: '50%' }}
				bottom={{ base: '12px', md: 'auto' }}
				left={{ base: 'max(12px, env(safe-area-inset-left))', md: 0 }}
				right={{ base: 'max(12px, env(safe-area-inset-right))', md: 0 }}
				mx='auto'
				transform={{ base: 'none', md: 'translateY(-50%)' }}
				w={{
					base: 'min(calc(100dvw - 24px), calc(100vw - 24px))',
					md: 'calc(100vw - 32px)',
				}}
				maxW='lg'
				maxH={{ base: 'none', md: 'calc(100vh - 24px)' }}
				bg='white'
				rounded='2xl'
				boxShadow='2xl'
				zIndex={50}
				display='flex'
				flexDirection='column'
				overflow='hidden'
			>
				{/* Header */}
				<Box
					px={{ base: 4, md: 6 }}
					py={4}
					borderBottomWidth='1px'
					borderColor='gray.200'
				>
					<Flex align='center' justify='space-between'>
						<Box>
							<Text
								fontSize={{ base: 'lg', md: 'xl' }}
								fontWeight='semibold'
								color='gray.900'
								mb={1}
							>
								Привязать камеру
							</Text>
							{(locationName || cameraName) && (
								<Text fontSize={{ base: 'xs', md: 'sm' }} color='gray.600'>
									{locationName && `Локация: ${locationName}`}
									{locationName && cameraName && ' · '}
									{cameraName && `Камера: ${cameraName}`}
								</Text>
							)}
						</Box>
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
				</Box>

				{/* Content */}
				<Box
					px={{ base: 4, md: 6 }}
					py={{ base: 4, md: 6 }}
					flex='1'
					minH={0}
					overflowY='auto'
				>
					<Stack direction='column' gap={{ base: 4, md: 6 }}>
						{/* QR Code */}
						<Flex justify='center'>
							<Box
								w={{ base: 48, sm: 56, md: 72 }}
								h={{ base: 48, sm: 56, md: 72 }}
								rounded='2xl'
								bgGradient='to-br'
								gradientFrom='blue.50'
								gradientTo='indigo.50'
								borderWidth='2px'
								borderColor='blue.200'
								p={4}
								display='flex'
								alignItems='center'
								justifyContent='center'
							>
								{qrCodeUrl && !isPending ? (
									<Image src={qrCodeUrl} alt='QR Code' w='full' h='full' />
								) : (
									<Stack align='center' gap={3}>
										<QrCode className='w-12 h-12 text-slate-400 animate-pulse' />
										<Text fontSize='sm' color='gray.500' textAlign='center'>
											Генерация QR-кода...
										</Text>
									</Stack>
								)}
							</Box>
						</Flex>

						{/* Instructions */}
						<Box
							rounded='xl'
							bg='gray.50'
							borderWidth='1px'
							borderColor='gray.200'
							p={4}
						>
							<Text fontSize='sm' fontWeight='medium' color='gray.900' mb={3}>
								Инструкция по подключению:
							</Text>
							<Stack as='ol' gap={2} fontSize='sm' color='gray.600'>
								<Flex as='li' gap={2}>
									<Text color='blue.600'>1.</Text>
									<Text>Откройте приложение на устройстве камеры</Text>
								</Flex>
								<Flex as='li' gap={2}>
									<Text color='blue.600'>2.</Text>
									<Text>
										Выберите «Добавить камеру» или «Подключить к системе»
									</Text>
								</Flex>
								<Flex as='li' gap={2}>
									<Text color='blue.600'>3.</Text>
									<Text>Отсканируйте QR‑код камерой устройства</Text>
								</Flex>
								<Flex as='li' gap={2}>
									<Text color='blue.600'>4.</Text>
									<Text>Дождитесь подтверждения подключения</Text>
								</Flex>
							</Stack>
						</Box>

						{/* Manual token */}
						<Box>
							<Text
								as='label'
								display='block'
								fontSize='sm'
								color='gray.700'
								mb={2}
							>
								Или введите токен вручную:
							</Text>
							<Flex direction={'column'} gap={2}>
								<Box
									flex={1}
									px={4}
									py={3}
									rounded='xl'
									bg='gray.50'
									borderWidth='1px'
									borderColor='gray.200'
									fontFamily='mono'
									fontSize='sm'
									color='gray.900'
									overflow='auto'
								>
									{externalToken ?? data?.token ?? '—'}
								</Box>
								<Button
									onClick={handleCopy}
									flexShrink={0}
									size={{ base: 'sm', md: 'md' }}
									h={{ base: 10, md: 11 }}
									w={{ base: 'full', md: 'auto' }}
									bg={copied ? 'green.100' : 'blue.100'}
									color={copied ? 'green.700' : 'blue.700'}
									_hover={{
										bg: copied ? 'green.200' : 'blue.200',
									}}
								>
									{copied ? (
										<>
											<Check className='w-4 h-4' />
											<Text>Скопировано</Text>
										</>
									) : (
										<>
											<Copy className='w-4 h-4' />
											<Text>Скопировать</Text>
										</>
									)}
								</Button>
							</Flex>
						</Box>

						{/* Info */}
						<Box
							rounded='xl'
							bg='blue.50'
							borderWidth='1px'
							borderColor='blue.200'
							p={4}
						>
							<Flex gap={3}>
								<Text fontSize='xs' color='blue.700'>
									Токен привязки действителен 5 минут. После подключения камера
									будет автоматически добавлена в выбранную локацию.
								</Text>
							</Flex>
						</Box>
					</Stack>
				</Box>

				{/* Footer */}
				<Box
					px={{ base: 4, md: 6 }}
					py={4}
					borderTopWidth='1px'
					borderColor='gray.200'
					bg='gray.50'
				>
					<Button
						onClick={onClose}
						w='full'
						size={{ base: 'sm', md: 'md' }}
						h={{ base: 10, md: 11 }}
						bgGradient='to-r'
						gradientFrom='brand.blue.500'
						gradientTo='brand.blue.700'
						color='white'
						borderRadius='xl'
						_hover={{
							boxShadow: 'lg',
						}}
					>
						Готово
					</Button>
				</Box>
			</Box>
		</>
	)
}
