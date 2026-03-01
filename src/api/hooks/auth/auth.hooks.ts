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
} from '@api/generated'
import { register, login, refresh, logout, getCurrentUser } from '@api/requests'

export const useRegister = (
	options?: Omit<
		UseMutationOptions<RegisterResponse, unknown, RegisterRequest>,
		'mutationKey' | 'mutationFn'
	>
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
	>
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
	>
) =>
	useMutation({
		mutationKey: ['refresh'],
		mutationFn: refresh,
		...options,
	})

export const useLogout = (
	options?: Omit<
		UseMutationOptions<unknown, unknown, void>,
		'mutationKey' | 'mutationFn'
	>
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
	>
) =>
	useQuery({
		queryKey: ['get user'],
		queryFn: getCurrentUser,
		retry: false,
		refetchOnWindowFocus: false,
		...options,
	})
