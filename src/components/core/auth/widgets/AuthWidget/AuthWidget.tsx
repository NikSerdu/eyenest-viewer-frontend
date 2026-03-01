import type { FC } from 'react'
import { Box, VStack, Heading, Text } from '@chakra-ui/react'
import { Logo } from '@/components/common/Logo/Logo'
import { AuthForm } from '../../features'
import type { LoginFormValues, RegisterFormValues } from '@auth/features'
import { useAuthForm } from '../../features/AuthForm/model/hooks'
import { useQueryClient } from '@tanstack/react-query'
export const AuthWidget: FC = () => {
	const {
		handlers: { login, register },
	} = useAuthForm()
	const queryClient = useQueryClient()
	const handleLogin = async (data: LoginFormValues) => {
		await login.mutateAsync(data)
		await queryClient.invalidateQueries({ queryKey: ['get user'] })
	}

	const handleRegister = async (data: RegisterFormValues) => {
		await register.mutateAsync(data)
		await queryClient.invalidateQueries({ queryKey: ['get user'] })
	}

	return (
		<Box w='full' maxW='md'>
			<VStack gap='1' mb='8'>
				<Logo />
				<Heading size='lg'>SecureView</Heading>
				<Text color='gray.500'>Система видеонаблюдения</Text>
			</VStack>

			<Box bg='white' p='8' rounded='3xl' boxShadow='2xl'>
				<AuthForm onLogin={handleLogin} onRegister={handleRegister} />
			</Box>
		</Box>
	)
}
