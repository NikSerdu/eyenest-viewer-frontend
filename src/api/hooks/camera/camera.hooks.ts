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
} from '@api/generated'
import {
	getLocations,
	createLocation,
	addCamera,
	linkCamera,
	getLinkCameraToken,
	getLiveKitViewerToken,
	startHlsRecording,
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

export const useStartHlsRecording = (
	options?: Omit<
		UseMutationOptions<string, unknown, { roomId: string; cameraId: string }>,
		'mutationKey' | 'mutationFn'
	>,
) =>
	useMutation({
		mutationKey: ['start hls recording'],
		mutationFn: ({ roomId, cameraId }) => startHlsRecording(roomId, cameraId),
		...options,
	})
