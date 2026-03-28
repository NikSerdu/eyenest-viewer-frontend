import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { UpdateUserNotificationSettingsRequest } from '@/api/generated'
import {
	useGetLinkTelegramToken,
	useGetUser,
	useGetUserNotificationSettings,
	useUnlinkTelegramAccount,
	useUpdateUserNotificationSettings,
} from '@/api/hooks'

export const useAccountNotificationSettings = () => {
	const [copied, setCopied] = useState(false)
	const [unlinkError, setUnlinkError] = useState<string | null>(null)
	const [localSettings, setLocalSettings] =
		useState<UpdateUserNotificationSettingsRequest | null>(null)

	const queryClient = useQueryClient()
	const { isLoading: isUserLoading, isError: isUserError } = useGetUser()
	const {
		data: notificationSettings,
		isLoading: isSettingsLoading,
		isError: isSettingsError,
	} = useGetUserNotificationSettings()
	const {
		data: linkTelegramTokenData,
		refetch: refetchLinkTelegramToken,
		isFetching: isLinkTokenLoading,
	} = useGetLinkTelegramToken({ enabled: false })

	const effectiveSettings = localSettings ?? notificationSettings ?? null

	const { mutate, isPending } = useUpdateUserNotificationSettings({
		onSuccess: data => {
			queryClient.setQueryData(['get user notification settings'], data)
			setLocalSettings({
				emailEnabled: data.emailEnabled,
				telegramEnabled: data.telegramEnabled,
			})
		},
		onError: () => {
			if (!notificationSettings) {
				return
			}
			setLocalSettings({
				emailEnabled: notificationSettings.emailEnabled,
				telegramEnabled: notificationSettings.telegramEnabled,
			})
		},
	})

	const { mutate: unlinkTelegram, isPending: isUnlinkPending } =
		useUnlinkTelegramAccount({
			onMutate: () => {
				setUnlinkError(null)
			},
			onSuccess: () => {
				void queryClient.invalidateQueries({
					queryKey: ['get user notification settings'],
				})
			},
			onError: () => {
				setUnlinkError('Не удалось отвязать Telegram. Попробуйте позже.')
			},
		})

	const canControl =
		!isPending && !isSettingsLoading && Boolean(effectiveSettings)
	const isSettingsBlockLoading = isUserLoading || isSettingsLoading
	const hasLinkedTelegram = Boolean(
		notificationSettings?.telegramChatId?.trim(),
	)

	const toggleSetting = (
		key: keyof UpdateUserNotificationSettingsRequest,
		nextValue: boolean,
	) => {
		if (!effectiveSettings) {
			return
		}
		const nextPayload: UpdateUserNotificationSettingsRequest = {
			emailEnabled: effectiveSettings.emailEnabled,
			telegramEnabled: effectiveSettings.telegramEnabled,
			[key]: nextValue,
		}
		setLocalSettings(nextPayload)
		mutate(nextPayload)
	}

	const copyLinkToken = () => {
		const token = linkTelegramTokenData?.token
		if (!token) return
		navigator.clipboard.writeText(token)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return {
		notificationSettings,
		effectiveSettings,
		linkTelegramTokenData,
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
	}
}
