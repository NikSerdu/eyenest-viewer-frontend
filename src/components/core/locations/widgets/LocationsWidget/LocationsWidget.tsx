import type { FC } from 'react'
import { useState } from 'react'
import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { Plus } from 'lucide-react'
import { LocationsGrid, CreateLocationModal } from '../../features'

export const LocationsWidget: FC = () => {
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	return (
		<Box w='full'>
			<Stack gap={6}>
				<Flex align='center' justify='space-between'>
					<Box>
						<Heading size='3xl'>Локации</Heading>
						<Text color='gray.600'>
							Управление камерами по физическим локациям
						</Text>
					</Box>
					<Button
						onClick={() => setIsCreateOpen(true)}
						bgGradient='to-r'
						gradientFrom='brand.blue.500'
						gradientTo='brand.blue.700'
						color='white'
						borderRadius='xl'
						_hover={{
							boxShadow: 'lg',
						}}
					>
						<Plus className='w-4 h-4' /> Добавить локацию
					</Button>
				</Flex>

				<LocationsGrid />
			</Stack>

			<CreateLocationModal
				isOpen={isCreateOpen}
				onClose={() => setIsCreateOpen(false)}
			/>
		</Box>
	)
}
