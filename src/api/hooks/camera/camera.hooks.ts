import {
	useMutation,
	useQuery,
	type UseMutationOptions,
	type UseQueryOptions,
} from '@tanstack/react-query'

import type {
	LocationResponse,
	CreateLocationRequest,
	AddCameraRequest,
	AddCameraResponse,
	LinkCameraRequest,
	LinkCameraResponse,
} from '@api/generated'
import {
	getLocations,
	createLocation,
	addCamera,
	linkCamera,
} from '@api/requests'

export const useGetLocations = (
	options?: Omit<
		UseQueryOptions<LocationResponse[], unknown>,
		'queryKey' | 'queryFn'
	>
) =>
	useQuery({
		queryKey: ['get locations'],
		queryFn: getLocations,
		...options,
	})

export const useCreateLocation = (
	options?: Omit<
		UseMutationOptions<LocationResponse, unknown, CreateLocationRequest>,
		'mutationKey' | 'mutationFn'
	>
) =>
	useMutation({
		mutationKey: ['create location'],
		mutationFn: createLocation,
		...options,
	})

export const useAddCamera = (
	options?: Omit<
		UseMutationOptions<AddCameraResponse, unknown, AddCameraRequest>,
		'mutationKey' | 'mutationFn'
	>
) =>
	useMutation({
		mutationKey: ['add camera'],
		mutationFn: addCamera,
		...options,
	})

export const useLinkCamera = (
	options?: Omit<
		UseMutationOptions<LinkCameraResponse, unknown, LinkCameraRequest>,
		'mutationKey' | 'mutationFn'
	>
) =>
	useMutation({
		mutationKey: ['link camera'],
		mutationFn: linkCamera,
		...options,
	})
