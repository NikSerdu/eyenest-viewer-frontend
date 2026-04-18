import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import { Logo } from '@/components/common/Logo/Logo'
import { AuthForm, OtpForm } from '../../features'
import type {
	AuthType,
	LoginFormValues,
	OtpFormValues,
	RegisterFormValues,
} from '@auth/features'
import { useLogin, useRegister, useCheckOtp } from '@/api/hooks'
import { useQueryClient } from '@tanstack/react-query'

type OtpFlow = 'login' | 'register'

export const AuthWidget: FC = () => {
	const [otpFlow, setOtpFlow] = useState<OtpFlow | null>(null)
	const queryClient = useQueryClient()
	const login = useLogin()
	const checkOtp = useCheckOtp()
	const register = useRegister()

	const handleAuthTypeChange = useCallback((value: AuthType) => {
		if (value === 'sign-up') {
			setOtpFlow(null)
		}
	}, [])

	const handleLogin = async (data: LoginFormValues) => {
		const res = await login.mutateAsync(data)
		if (res.success) {
			setOtpFlow('login')
		}
	}

	const handleOtpSubmit = async (data: OtpFormValues) => {
		await checkOtp.mutateAsync(data)
		setOtpFlow(null)
		await queryClient.invalidateQueries({ queryKey: ['get user'] })
	}

	const handleOtpBack = () => {
		setOtpFlow(null)
	}

	const handleRegister = async (data: RegisterFormValues) => {
		const res = await register.mutateAsync(data)
		if (res.success) {
			setOtpFlow('register')
		}
	}

	const title =
		otpFlow === 'login'
			? 'Подтверждение входа'
			: otpFlow === 'register'
				? 'Подтверждение регистрации'
				: 'EyeNest'
	const subtitle =
		otpFlow !== null ? 'Введите одноразовый код' : 'Система видеонаблюдения'

	return (
		<Box w='full' maxW='md' className='relative'>
			<VStack gap='1' mb={{ base: 5, md: 8 }}>
				<Logo />
				<Heading size={{ base: 'md', md: 'lg' }} textAlign='center'>
					{title}
				</Heading>
				<Text color='gray.500' textAlign='center' fontSize={{ base: 'sm', md: 'md' }}>
					{subtitle}
				</Text>
			</VStack>

			<Box bg='white' p={{ base: 4, sm: 6, md: 8 }} rounded='3xl' boxShadow='2xl'>
				{otpFlow !== null ? (
					<OtpForm
						onSubmit={handleOtpSubmit}
						onBack={handleOtpBack}
						isPending={checkOtp.isPending}
						backLabel={
							otpFlow === 'register' ? 'Назад к регистрации' : 'Назад к входу'
						}
					/>
				) : (
					<AuthForm
						onLogin={handleLogin}
						onRegister={handleRegister}
						onAuthTypeChange={handleAuthTypeChange}
					/>
				)}
			</Box>
		</Box>
	)
}
