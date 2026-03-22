import { authInstance } from '@/api/axios/authInstance'
import type {
	LocationResponse,
	CreateLocationRequest,
	AddCameraRequest,
	AddCameraResponse,
	LinkCameraRequest,
	LinkCameraResponse,
	GetLinkCameraTokenRequest,
	GetLinkCameraTokenResponse,
	GetLiveKitViewerTokenResponse,
	UpdateCameraSettingsRequest,
	CameraSettingsResponse,
	CameraResponse,
	GetCameraByIdRequest,
	DeleteCameraRequest,
	DeleteLocationRequest,
} from '@api/generated'

export const getLocations = () =>
	authInstance
		.get<LocationResponse[]>('/camera/locations')
		.then(response => response.data)

export const createLocation = (data: CreateLocationRequest) =>
	authInstance
		.post<LocationResponse>('/camera/locations', data)
		.then(response => response.data)

export const addCamera = (data: AddCameraRequest) =>
	authInstance
		.post<AddCameraResponse>('/camera/addCamera', data)
		.then(response => response.data)

export const linkCamera = (data: LinkCameraRequest) =>
	authInstance
		.post<LinkCameraResponse>('/camera/linkCamera', data)
		.then(response => response.data)

export const getLinkCameraToken = (data: GetLinkCameraTokenRequest) =>
	authInstance
		.post<GetLinkCameraTokenResponse>('/camera/getLinkCameraToken', data)
		.then(response => response.data)

export const getLiveKitViewerToken = (roomId: string) =>
	authInstance
		.get<GetLiveKitViewerTokenResponse>('/live_kit/getLiveKitViewerToken', {
			params: { roomId },
		})
		.then(response => response.data)

export const updateCameraSettings = (data: UpdateCameraSettingsRequest) =>
	authInstance
		.post<CameraSettingsResponse>('/camera/updateCameraSettings', data)
		.then(response => response.data)

export const getCameraById = (data: GetCameraByIdRequest) =>
	authInstance
		.get<CameraResponse>('/camera/getCameraById', { params: data })
		.then(response => response.data)

export const deleteCamera = (data: DeleteCameraRequest) =>
	authInstance
		.delete<CameraResponse>(`/camera/deleteCamera`, { data })
		.then(response => response.data)
export const deleteLocation = (data: DeleteLocationRequest) =>
	authInstance
		.delete<LocationResponse>(`/camera/deleteLocation`, { data })
		.then(response => response.data)
