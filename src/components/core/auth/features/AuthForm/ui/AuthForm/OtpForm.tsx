import type { FC } from 'react'
import { VStack, Field, Input, Button, Text } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { otpSchema, type OtpFormValues } from '../../model/schemas/auth.schema'

interface OtpFormProps {
	onSubmit: (data: OtpFormValues) => void | Promise<void>
	onBack: () => void
	isPending?: boolean
	/** Подпись кнопки возврата к форме email/пароль */
	backLabel?: string
}

export const OtpForm: FC<OtpFormProps> = ({
	onSubmit,
	onBack,
	isPending = false,
	backLabel = 'Назад',
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OtpFormValues>({
		resolver: zodResolver(otpSchema),
		defaultValues: { code: '' },
	})

	return (
		<VStack gap='5' as='form' onSubmit={handleSubmit(onSubmit)} w='full'>
			<Text color='gray.600' textAlign='center' textStyle='sm'>
				Мы отправили код на вашу почту. Код действует 5 минут.
			</Text>
			<Field.Root invalid={!!errors.code}>
				<Field.Label>Код из письма</Field.Label>
				<Input
					inputMode='numeric'
					autoComplete='one-time-code'
					placeholder='000000'
					maxLength={6}
					letterSpacing='0.2em'
					textAlign='center'
					fontVariantNumeric='tabular-nums'
					{...register('code')}
				/>
				<Field.ErrorText>{errors.code?.message}</Field.ErrorText>
			</Field.Root>
			<VStack gap='3' w='full'>
				<Button
					variant='primary'
					size='lg'
					className='w-full'
					type='submit'
					loading={isPending}
					disabled={isPending}
				>
					Подтвердить
					<ArrowRight size={18} />
				</Button>
				<Button
					variant='ghost'
					size='md'
					className='w-full'
					type='button'
					onClick={onBack}
					disabled={isPending}
				>
					<ArrowLeft size={18} />
					{backLabel}
				</Button>
			</VStack>
		</VStack>
	)
}
