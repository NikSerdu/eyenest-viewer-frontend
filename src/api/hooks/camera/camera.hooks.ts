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
	GetLiveKitViewerTokenResponse,
	GetLinkCameraTokenResponse,
	GetLinkCameraTokenRequest,
	CameraSettingsResponse,
	UpdateCameraSettingsRequest,
	CameraResponse,
	DeleteCameraRequest,
	DeleteLocationRequest,
} from '@api/generated'
import {
	getLocations,
	createLocation,
	addCamera,
	linkCamera,
	getLinkCameraToken,
	getLiveKitViewerToken,
	updateCameraSettings,
	getCameraById,
	deleteCamera,
	deleteLocation,
} from '@api/requests'

export const useGetLocations = (
	options?: Omit<
		UseQueryOptions<LocationResponse[], unknown>,
		'queryKey' | 'queryFn'
	>,
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
	>,
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
	>,
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
	>,
) =>
	useMutation({
		mutationKey: ['link camera'],
		mutationFn: linkCamera,
		...options,
	})

export const useGetLinkCameraToken = (
	options?: Omit<
		UseMutationOptions<
			GetLinkCameraTokenResponse,
			unknown,
			GetLinkCameraTokenRequest
		>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['get link camera token'],
		mutationFn: getLinkCameraToken,
		...options,
	})

export const useGetLiveKitViewerToken = (
	roomId: string | null,
	options?: Omit<
		UseQueryOptions<GetLiveKitViewerTokenResponse, unknown>,
		'queryKey' | 'queryFn' | 'enabled'
	>,
) =>
	useQuery({
		queryKey: ['get live kit viewer token', roomId],
		queryFn: () => getLiveKitViewerToken(roomId as string),
		enabled: !!roomId,
		...options,
	})

export const useUpdateCameraSettings = (
	options?: Omit<
		UseMutationOptions<
			CameraSettingsResponse,
			unknown,
			UpdateCameraSettingsRequest
		>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['update camera settings'],
		mutationFn: updateCameraSettings,
		...options,
	})

export const useGetCameraById = (
	cameraId: string,
	options?: Omit<
		UseQueryOptions<CameraResponse, unknown>,
		'queryKey' | 'queryFn' | 'enabled'
	>,
) =>
	useQuery({
		queryKey: [`get camera by id ${cameraId}`],
		queryFn: () => getCameraById({ cameraId }),
		enabled: !!cameraId,
		...options,
	})

export const useDeleteCamera = (
	options?: Omit<
		UseMutationOptions<CameraResponse, unknown, DeleteCameraRequest>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['delete camera'],
		mutationFn: deleteCamera,
		...options,
	})

export const useDeleteLocation = (
	options?: Omit<
		UseMutationOptions<LocationResponse, unknown, DeleteLocationRequest>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['delete location'],
		mutationFn: deleteLocation,
		...options,
	})
