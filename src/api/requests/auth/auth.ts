import { authInstance } from '@/api/axios/authInstance'
import { baseInstance } from '@/api/axios/baseInstance'
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

export const register = (data: RegisterRequest) =>
	baseInstance
		.post<RegisterResponse>('/auth/register', data)
		.then(response => response.data)

export const login = (data: LoginRequest) =>
	baseInstance
		.post<LoginResponse>('/auth/login', data)
		.then(response => response.data)

export const refresh = () =>
	baseInstance.post('/auth/refresh').then(response => response.data)

export type LogoutResponse = { ok: boolean }

export const logout = () =>
	baseInstance
		.post<LogoutResponse>('/auth/logout')
		.then(response => response.data)

export const getCurrentUser = () =>
	authInstance
		.get<GetUserResponse>('/auth/getUser')
		.then(response => response.data)

export const getUserNotificationSettings = () =>
	authInstance
		.get<GetUserNotificationSettingsResponse>(
			'/auth/getUserNotificationSettings',
		)
		.then(response => response.data)

export const getLinkTelegramToken = () =>
	authInstance
		.get<GetLinkTelegramTokenResponse>('/notifications/getLinkTelegramToken')
		.then(response => response.data)

export const updateUserNotificationSettings = (
	data: UpdateUserNotificationSettingsRequest,
) =>
	authInstance
		.put<GetUserNotificationSettingsResponse>(
			'/auth/updateUserNotificationSettings',
			data,
		)
		.then(response => response.data)

export const unlinkTelegramAccount = () =>
	authInstance
		.delete<UnlinkTelegramAccountResponse>('/notifications/unlinkTelegram')
		.then(response => response.data)
