import { authInstance } from '@/api/axios/authInstance'
import { baseInstance } from '@/api/axios/baseInstance'
import type {
	RegisterRequest,
	RegisterResponse,
	LoginRequest,
	LoginResponse,
	GetUserResponse,
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

export const logout = () =>
	baseInstance.post('/auth/logout').then(response => response.data)

export const getCurrentUser = () =>
	authInstance
		.get<GetUserResponse>('/auth/getUser')
		.then(response => response.data)
