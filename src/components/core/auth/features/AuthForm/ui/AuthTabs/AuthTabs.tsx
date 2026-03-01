import type { FC } from 'react'
import { Tabs } from '@chakra-ui/react'
import type { AuthType } from '../../model/types/types'

interface AuthTabsProps {
	value: AuthType
	onChange: (value: AuthType) => void
}

export const AuthTabs: FC<AuthTabsProps> = ({ value, onChange }) => {
	return (
		<Tabs.Root
			variant='enclosed'
			borderRadius='2xl'
			w='full'
			value={value}
			onValueChange={e => onChange(e.value as AuthType)}
		>
			<Tabs.List w='full' display='flex' borderRadius='xl'>
				<Tabs.Trigger value='sign-in' flex='1' borderRadius='xl'>
					Вход
				</Tabs.Trigger>
				<Tabs.Trigger value='sign-up' flex='1' borderRadius='xl'>
					Регистрация
				</Tabs.Trigger>
				<Tabs.Indicator borderRadius='xl' />
			</Tabs.List>
		</Tabs.Root>
	)
}
