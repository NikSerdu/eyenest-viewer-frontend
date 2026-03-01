import type { FC } from 'react'
import { Input, InputGroup, IconButton } from '@chakra-ui/react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface PasswordInputProps {
	register: UseFormRegisterReturn
	showPassword: boolean
	onToggleVisibility: () => void
	placeholder?: string
}

export const PasswordInput: FC<PasswordInputProps> = ({
	register,
	showPassword,
	onToggleVisibility,
	placeholder = 'Введите пароль',
}) => {
	return (
		<InputGroup
			startElement={<Lock size={18} />}
			endElement={
				<IconButton
					variant='ghost'
					size='xs'
					onClick={onToggleVisibility}
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					type='button'
				>
					{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
				</IconButton>
			}
			w='full'
		>
			<Input
				type={showPassword ? 'text' : 'password'}
				placeholder={placeholder}
				{...register}
			/>
		</InputGroup>
	)
}
