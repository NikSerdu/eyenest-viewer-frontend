import { EVENTS } from '../types/events'
import { io } from 'socket.io-client'

const ICE_SERVERS = [
	{ urls: 'stun:85.193.91.142:3478' },
	{
		urls: 'turn:85.193.91.142:3478',
		username: 'testuser',
		credential: 'testpassword',
	},
]

class WebRTCManager {
	private socket = io('https://5.42.111.58:3000', {
		transports: ['websocket'],
	})
	cameraPeerConnections: Record<string, RTCPeerConnection> = {}
	private cameraMediaElements: Record<string, HTMLVideoElement | null> = {}
	private peerToRoom: Record<string, string> = {}
	constructor() {
		this.initSocket()
	}

	initSocket() {
		this.socket.on(EVENTS.SHARE_CAMERA_PEER_ID, this.handleAddCameraPeer)
		this.socket.on(EVENTS.RELAY_SDP, this.handleRelaySDP)
		this.socket.on(EVENTS.RELAY_ICE, this.handleRelayICE)
	}

	handleAddCameraPeer = async ({
		peerID: cameraPeerID,
		roomID,
	}: {
		peerID: string
		roomID: string
	}) => {
		this.peerToRoom[cameraPeerID] = roomID
		const pc = new RTCPeerConnection({
			iceServers: ICE_SERVERS,
			iceCandidatePoolSize: 10, // Больше кандидатов
			iceTransportPolicy: 'all', // Пробовать все типы
		})
		this.cameraPeerConnections[roomID] = pc
		pc.onicecandidate = event => {
			if (event.candidate) {
				this.socket.emit(EVENTS.RELAY_ICE, {
					peerID: cameraPeerID,
					iceCandidate: event.candidate,
				})
			}
		}

		pc.ontrack = ({ streams: [remoteStream] }) => {
			const mediaEl = this.cameraMediaElements[roomID]
			if (mediaEl) {
				mediaEl.srcObject = remoteStream
			}
		}
		pc.oniceconnectionstatechange = async () => {
			console.log('ICE state:', pc.iceConnectionState)

			if (
				pc.iceConnectionState === 'connected' ||
				pc.iceConnectionState === 'completed'
			) {
				const stats = await pc.getStats()

				stats.forEach(report => {
					if (
						report.type === 'candidate-pair' &&
						report.state === 'succeeded'
					) {
						const local = stats.get(report.localCandidateId)
						const remote = stats.get(report.remoteCandidateId)

						console.log('Selected ICE pair')
						console.log('Local candidate:', local)
						console.log('Remote candidate:', remote)

						console.log('Connection type:', local?.candidateType)
					}
				})
			}
		}
		const offer = await pc.createOffer({
			offerToReceiveAudio: true,
			offerToReceiveVideo: true,
		})
		await pc.setLocalDescription(offer)
		this.socket.emit(EVENTS.RELAY_SDP, {
			peerID: cameraPeerID,
			sessionDescription: offer,
		})
	}

	handleRelaySDP = async ({
		peerID: cameraPeerID,
		sessionDescription,
	}: {
		peerID: string
		sessionDescription: RTCSessionDescriptionInit
	}) => {
		const cameraPC = this.cameraPeerConnections[this.peerToRoom[cameraPeerID]]
		if (cameraPC) {
			await cameraPC.setRemoteDescription(
				new RTCSessionDescription(sessionDescription)
			)
		}
	}

	handleRelayICE = ({
		peerID: cameraPeerID,
		iceCandidate,
	}: {
		peerID: string
		iceCandidate: RTCLocalIceCandidateInit
	}) => {
		const cameraPC = this.cameraPeerConnections[this.peerToRoom[cameraPeerID]]
		if (cameraPC) {
			console.log(iceCandidate)

			cameraPC.addIceCandidate(new RTCIceCandidate(iceCandidate))
		}
	}

	handleJoin = (roomID: string) => {
		this.socket.emit(EVENTS.JOIN, { roomID: roomID, isCamera: false })
	}

	removeRoom(roomID: string) {
		const pc = this.cameraPeerConnections[roomID]

		if (pc) {
			pc.close()
			delete this.cameraPeerConnections[roomID]
		}

		delete this.cameraMediaElements[roomID]
	}

	provideMediaRef = (roomID: string, node: HTMLVideoElement | null) => {
		this.cameraMediaElements[roomID] = node

		if (node) {
			const pc = this.cameraPeerConnections[roomID]
			if (pc) {
				this.attachStreamToVideo(pc, node)
			}
		}
	}

	private attachStreamToVideo(
		pc: RTCPeerConnection,
		videoElement: HTMLVideoElement
	) {
		const receivers = pc.getReceivers()
		const tracks = receivers
			.map(r => r.track)
			.filter(track => track && track.kind === 'video')

		if (tracks.length > 0) {
			const stream = new MediaStream(tracks)
			videoElement.srcObject = stream
			return
		}
	}
}
export const webRTCManager = new WebRTCManager()
