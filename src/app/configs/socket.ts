import { io, type ManagerOptions, type SocketOptions } from 'socket.io-client'

const options: Partial<ManagerOptions & SocketOptions> = {
	transports: ['websocket'],
	forceNew: true,
}

export const socketWebRTC = io('localhost:3000', options)
