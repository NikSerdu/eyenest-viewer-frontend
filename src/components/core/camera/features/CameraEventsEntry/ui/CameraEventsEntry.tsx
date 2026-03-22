import { Box, Button, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import { Bell } from 'lucide-react'
import type { FC } from 'react'
import { Link } from 'react-router-dom'

interface CameraEventsEntryProps {
	cameraId: string
}

export const CameraEventsEntry: FC<CameraEventsEntryProps> = ({ cameraId }) => {
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
						<Bell size={14} />
					</Box>
					<Stack gap={0}>
						<Heading size='xs'>События камеры</Heading>
						<Text fontSize='xs' color='gray.600'>
							Журнал событий с фильтрами по типу и дате
						</Text>
					</Stack>
				</Flex>

				<Link to={`/${cameraId}/events`} style={{ textDecoration: 'none', width: '100%' }}>
					<Button as='span' size='sm' variant='outline' w={{ base: '100%', sm: 'auto' }}>
						Открыть события
					</Button>
				</Link>
			</Flex>
		</Box>
	)
}
