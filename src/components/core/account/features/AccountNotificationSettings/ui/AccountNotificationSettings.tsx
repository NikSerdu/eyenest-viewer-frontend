import type { FC } from 'react'
import {
	Box,
	Button,
	Flex,
	Heading,
	Progress,
	Spinner,
	Stack,
	Switch,
	Text,
} from '@chakra-ui/react'
import { Bell, Check, Copy, Mail, MessageCircle, Unlink } from 'lucide-react'

import { useAccountNotificationSettings } from '../model/hooks'

export const AccountNotificationSettings: FC = () => {
	const {
		notificationSettings,
		effectiveSettings,
		linkTelegramTokenData,
		linkTokenExpiry,
		copied,
		unlinkError,
		canControl,
		isSettingsBlockLoading,
		isUserError,
		isSettingsError,
		hasLinkedTelegram,
		isLinkTokenLoading,
		isUnlinkPending,
		toggleSetting,
		refetchLinkTelegramToken,
		copyLinkToken,
		unlinkTelegram,
	} = useAccountNotificationSettings()

	return (
		<Box
			borderRadius='2xl'
			bg='whiteAlpha.700'
			backdropFilter='blur(12px)'
			borderWidth='1px'
			borderColor='gray.200'
			boxShadow='md'
			p={6}
		>
			<Stack gap={4}>
				<Flex align='center' gap={3}>
					<Flex
						boxSize={10}
						borderRadius='lg'
						bg='blue.100'
						align='center'
						justify='center'
					>
						<Bell size={18} className='text-blue-600' />
					</Flex>
					<Box>
						<Heading size='sm'>Уведомления</Heading>
						<Text fontSize='sm' color='gray.600'>
							Управление каналами уведомлений
						</Text>
					</Box>
				</Flex>

				{isSettingsBlockLoading && (
					<Flex align='center' gap={3}>
						<Spinner size='sm' color='brand.blue.500' />
						<Text fontSize='sm' color='gray.600'>
							Загрузка настроек...
						</Text>
					</Flex>
				)}

				{(isUserError || isSettingsError) && (
					<Box
						p={3}
						borderRadius='lg'
						bg='red.50'
						borderWidth='1px'
						borderColor='red.200'
					>
						<Text fontSize='sm' color='red.600'>
							Не удалось загрузить данные аккаунта.
						</Text>
					</Box>
				)}

				{!isSettingsBlockLoading && !isSettingsError && effectiveSettings && (
					<Stack gap={3}>
						<Stack
							gap={2}
							borderWidth='1px'
							borderColor='gray.100'
							borderRadius='lg'
							bg='whiteAlpha.500'
							p={3}
						>
							<Flex justify='space-between' align='center' gap={3}>
								<Box>
									<Flex align='center' gap={2}>
										<Mail size={16} />
										<Text fontSize='sm' fontWeight='semibold' color='gray.800'>
											Email уведомления
										</Text>
									</Flex>
									<Text fontSize='xs' color='gray.600'>
										Получать уведомления на email
									</Text>
								</Box>
								<Switch.Root
									checked={effectiveSettings.emailEnabled}
									disabled={!canControl}
									onCheckedChange={({ checked }) =>
										toggleSetting('emailEnabled', checked)
									}
									colorPalette='blue'
								>
									<Switch.HiddenInput />
									<Switch.Control />
								</Switch.Root>
							</Flex>

							<Flex justify='space-between' align='center' gap={3}>
								<Box>
									<Flex align='center' gap={2}>
										<MessageCircle size={16} />
										<Text fontSize='sm' fontWeight='semibold' color='gray.800'>
											Telegram уведомления
										</Text>
									</Flex>
									<Text fontSize='xs' color='gray.600'>
										Отправлять уведомления в Telegram
									</Text>
								</Box>
								<Switch.Root
									checked={effectiveSettings.telegramEnabled}
									disabled={!canControl}
									onCheckedChange={({ checked }) =>
										toggleSetting('telegramEnabled', checked)
									}
									colorPalette='blue'
								>
									<Switch.HiddenInput />
									<Switch.Control />
								</Switch.Root>
							</Flex>
						</Stack>

						{hasLinkedTelegram && (
							<Box
								p={4}
								borderRadius='lg'
								bg='orange.50'
								borderWidth='1px'
								borderColor='orange.200'
							>
								<Stack gap={3}>
									<Flex align='center' gap={2}>
										<Unlink size={16} className='text-orange-700' />
										<Text
											fontSize='sm'
											fontWeight='semibold'
											color='orange.900'
										>
											Telegram привязан
										</Text>
									</Flex>

									{unlinkError && (
										<Text fontSize='sm' color='red.600'>
											{unlinkError}
										</Text>
									)}
									<Button
										size='sm'
										variant='outline'
										colorPalette='red'
										alignSelf='flex-start'
										loading={isUnlinkPending}
										disabled={isUnlinkPending}
										onClick={() => unlinkTelegram()}
									>
										Отвязать Telegram
									</Button>
								</Stack>
							</Box>
						)}

						{!notificationSettings?.telegramChatId &&
							notificationSettings?.telegramEnabled && (
								<Box
									p={4}
									borderRadius='lg'
									bg='blue.50'
									borderWidth='1px'
									borderColor='blue.200'
								>
									<Stack gap={3}>
										<Text fontSize='sm' fontWeight='semibold' color='blue.800'>
											Подключение Telegram
										</Text>
										<Text fontSize='sm' color='blue.700'>
											Зайдите в Telegram-бота, введите команду /start, затем
											укажите код подключения.
										</Text>
										<Flex gap={3} align='center' wrap='wrap'>
											<Button
												size='sm'
												colorScheme='blue'
												onClick={() => void refetchLinkTelegramToken()}
												loading={isLinkTokenLoading}
											>
												Получить новый код подключения
											</Button>

											{linkTelegramTokenData?.token && (
												<Stack gap={3} w='full'>
													{linkTokenExpiry && (
														<Stack gap={2}>
															<Flex
																justify='space-between'
																align='center'
																gap={3}
																flexWrap='wrap'
															>
																<Text fontSize='xs' color='blue.800'>
																	{linkTokenExpiry.expired
																		? 'Срок действия кода истёк'
																		: 'Код действителен'}
																</Text>
																<Text
																	fontSize='xs'
																	fontWeight='semibold'
																	fontFamily='mono'
																	color={
																		linkTokenExpiry.expired
																			? 'red.600'
																			: 'blue.900'
																	}
																>
																	{linkTokenExpiry.label}
																</Text>
															</Flex>
															<Progress.Root
																value={linkTokenExpiry.progressPercent}
																max={100}
																size='sm'
																colorPalette={
																	linkTokenExpiry.expired
																		? 'red'
																		: linkTokenExpiry.progressPercent < 25
																			? 'orange'
																			: 'blue'
																}
																variant='subtle'
															>
																<Progress.Track borderRadius='full'>
																	<Progress.Range borderRadius='full' />
																</Progress.Track>
															</Progress.Root>
															{linkTokenExpiry.expired && (
																<Text fontSize='xs' color='red.600'>
																	Запросите новый код — этот больше не подойдёт
																	для бота.
																</Text>
															)}
														</Stack>
													)}
													<Flex direction='row' gap={2}>
														<Box
															flex={1}
															px={4}
															py={3}
															rounded='xl'
															bg='gray.50'
															borderWidth='1px'
															borderColor='gray.200'
															fontFamily='mono'
															fontSize='sm'
															color='gray.900'
															overflow='auto'
														>
															{linkTelegramTokenData.token}
														</Box>
														<Button
															onClick={copyLinkToken}
															flexShrink={0}
															bg={copied ? 'green.100' : 'blue.100'}
															color={copied ? 'green.700' : 'blue.700'}
															_hover={{
																bg: copied ? 'green.200' : 'blue.200',
															}}
														>
															{copied ? (
																<>
																	<Check className='w-4 h-4' />
																	<Text>Скопировано</Text>
																</>
															) : (
																<>
																	<Copy className='w-4 h-4' />
																	<Text>Скопировать</Text>
																</>
															)}
														</Button>
													</Flex>
												</Stack>
											)}
										</Flex>
									</Stack>
								</Box>
							)}
					</Stack>
				)}
			</Stack>
		</Box>
	)
}
