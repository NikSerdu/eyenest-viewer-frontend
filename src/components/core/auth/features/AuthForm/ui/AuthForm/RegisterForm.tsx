import type { FC } from 'react'
import { VStack, Field, Input, InputGroup, Button } from '@chakra-ui/react'
import { Mail, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordInput } from '../PasswordInput/PasswordInput'
import {
	registerSchema,
	type RegisterFormValues,
} from '../../model/schemas/auth.schema'

interface RegisterFormProps {
	onSubmit: (data: RegisterFormValues) => void
	showPassword: boolean
	showConfirmPassword: boolean
	onTogglePassword: () => void
	onToggleConfirmPassword: () => void
}

export const RegisterForm: FC<RegisterFormProps> = ({
	onSubmit,
	showPassword,
	showConfirmPassword,
	onTogglePassword,
	onToggleConfirmPassword,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
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

			<Field.Root invalid={!!errors.confirmPassword}>
				<Field.Label>Подтвердите пароль</Field.Label>
				<PasswordInput
					register={register('confirmPassword')}
					showPassword={showConfirmPassword}
					onToggleVisibility={onToggleConfirmPassword}
					placeholder='Повторите пароль'
				/>
				<Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
			</Field.Root>

			<Button variant='primary' size='lg' className='w-full' type='submit'>
				Создать аккаунт
				<ArrowRight size={18} />
			</Button>
		</VStack>
	)
}
