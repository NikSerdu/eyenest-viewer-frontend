import {
	useMutation,
	useQuery,
	type UseMutationOptions,
	type UseQueryOptions,
} from '@tanstack/react-query'

import type {
	RegisterRequest,
	RegisterResponse,
	LoginRequest,
	LoginResponse,
	GetUserResponse,
	GetUserNotificationSettingsResponse,
	GetLinkTelegramTokenResponse,
	UpdateUserNotificationSettingsRequest,
	UnlinkTelegramAccountResponse,
} from '@api/generated'
import type { LogoutResponse } from '@api/requests/auth/auth'
import {
	register,
	login,
	refresh,
	logout,
	getCurrentUser,
	getUserNotificationSettings,
	getLinkTelegramToken,
	updateUserNotificationSettings,
	unlinkTelegramAccount,
} from '@api/requests'

export const useRegister = (
	options?: Omit<
		UseMutationOptions<RegisterResponse, unknown, RegisterRequest>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['register'],
		mutationFn: register,
		...options,
	})

export const useLogin = (
	options?: Omit<
		UseMutationOptions<LoginResponse, unknown, LoginRequest>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['login'],
		mutationFn: login,
		...options,
	})

export const useRefresh = (
	options?: Omit<
		UseMutationOptions<unknown, unknown, void>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['refresh'],
		mutationFn: refresh,
		...options,
	})

export const useLogout = (
	options?: Omit<
		UseMutationOptions<LogoutResponse, unknown, void>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['logout'],
		mutationFn: logout,
		...options,
	})

export const useGetUser = (
	options?: Omit<
		UseQueryOptions<GetUserResponse, unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get user'],
		queryFn: getCurrentUser,
		retry: false,
		refetchOnWindowFocus: false,
		...options,
	})

export const useGetUserNotificationSettings = (
	options?: Omit<
		UseQueryOptions<GetUserNotificationSettingsResponse, unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get user notification settings'],
		queryFn: getUserNotificationSettings,
		retry: false,
		refetchOnWindowFocus: false,
		...options,
	})

export const useGetLinkTelegramToken = (
	options?: Omit<
		UseQueryOptions<GetLinkTelegramTokenResponse, unknown>,
		'queryKey' | 'queryFn'
	>,
) =>
	useQuery({
		queryKey: ['get link telegram token'],
		queryFn: getLinkTelegramToken,
		retry: false,
		refetchOnWindowFocus: false,
		...options,
	})

export const useUpdateUserNotificationSettings = (
	options?: Omit<
		UseMutationOptions<
			GetUserNotificationSettingsResponse,
			unknown,
			UpdateUserNotificationSettingsRequest
		>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['update user notification settings'],
		mutationFn: updateUserNotificationSettings,
		...options,
	})

export const useUnlinkTelegramAccount = (
	options?: Omit<
		UseMutationOptions<UnlinkTelegramAccountResponse, unknown, void>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['unlink telegram account'],
		mutationFn: unlinkTelegramAccount,
		...options,
	})
