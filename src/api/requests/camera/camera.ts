import { authInstance } from '@/api/axios/authInstance'
import type {
	LocationResponse,
	CreateLocationRequest,
	AddCameraRequest,
	AddCameraResponse,
	LinkCameraRequest,
	LinkCameraResponse,
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
