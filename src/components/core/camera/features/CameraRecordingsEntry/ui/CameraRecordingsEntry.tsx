import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { CalendarRange } from 'lucide-react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface CameraRecordingsEntryProps {
	cameraId: string
}

export const CameraRecordingsEntry: FC<CameraRecordingsEntryProps> = ({ cameraId }) => {
	return (
		<Box
			borderRadius='xl'
			bg='whiteAlpha.700'
			backdropFilter='blur(12px)'
			borderWidth='1px'
			borderColor='gray.200'
			boxShadow='md'
			p={{ base: 3, md: 4 }}
		>
			<Flex
				justify='space-between'
				align='center'
				gap={3}
				direction={{ base: 'column', sm: 'row' }}
			>
				<Flex align='center' gap={2.5}>
					<Box
						boxSize={8}
						borderRadius='lg'
						bgGradient='to-br'
						gradientFrom='brand.blue.500'
						gradientTo='brand.blue.700'
						display='flex'
						alignItems='center'
						justifyContent='center'
						color='white'
						boxShadow='sm'
					>
						<CalendarRange size={14} />
					</Box>
					<Stack gap={0}>
						<Heading size='xs'>Записи с камеры</Heading>
						<Text fontSize='xs' color='gray.600'>
							Список записей и просмотр в плеере
						</Text>
					</Stack>
				</Flex>

				<Link to={`/${cameraId}/recordings`} style={{ textDecoration: 'none', width: '100%' }}>
					<Button as='span' size='sm' variant='outline' w={{ base: '100%', sm: 'auto' }}>
						Открыть записи
					</Button>
				</Link>
			</Flex>
		</Box>
	)
}
