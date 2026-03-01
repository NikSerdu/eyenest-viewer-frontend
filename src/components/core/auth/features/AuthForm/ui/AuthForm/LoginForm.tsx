import type { FC } from 'react'
import { VStack, Field, Input, InputGroup, Button } from '@chakra-ui/react'
import { Mail, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordInput } from '../PasswordInput/PasswordInput'
import {
	loginSchema,
	type LoginFormValues,
} from '../../model/schemas/auth.schema'

interface LoginFormProps {
	onSubmit: (data: LoginFormValues) => void
	showPassword: boolean
	onTogglePassword: () => void
}

export const LoginForm: FC<LoginFormProps> = ({
	onSubmit,
	showPassword,
	onTogglePassword,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	return (
		<VStack gap='5' as='form' onSubmit={handleSubmit(onSubmit)} w={'full'}>
			<Field.Root invalid={!!errors.email}>
				<Field.Label>Email</Field.Label>
				<InputGroup startElement={<Mail size={18} />} w='full'>
					<Input
						type='email'
						placeholder='Введите email'
						{...register('email')}
					/>
				</InputGroup>
				<Field.ErrorText>{errors.email?.message}</Field.ErrorText>
			</Field.Root>

			<Field.Root invalid={!!errors.password}>
				<Field.Label>Пароль</Field.Label>
				<PasswordInput
					register={register('password')}
					showPassword={showPassword}
					onToggleVisibility={onTogglePassword}
				/>
				<Field.ErrorText>{errors.password?.message}</Field.ErrorText>
			</Field.Root>

			<Button variant='primary' size='lg' className='w-full' type='submit'>
				Войти в систему
				<ArrowRight size={18} />
			</Button>
		</VStack>
	)
}
