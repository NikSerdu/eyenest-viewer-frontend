import { socketWebRTC } from '@/app/configs/socket'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EVENTS } from '../types/events'

interface IUseWebRTC {
	roomID: string
}

export const useWebRTC = ({ roomID }: IUseWebRTC) => {
	const cameraPeerConnection = useRef<RTCPeerConnection | null>(null)
	const cameraMediaElement = useRef<HTMLVideoElement | null>(null)
	const [cameraPeerId, setCameraPeerId] = useState<string | null>()
	const handleAddCameraPeer = async ({ peerID }: { peerID: string }) => {
		console.log(`вызов add camera peer ${peerID} ${roomID}`)

		setCameraPeerId(peerID)
		cameraPeerConnection.current = new RTCPeerConnection({
			iceServers: [
				{
					urls: 'stun:stun.l.google.com:19302',
				},
			],
		})
		cameraPeerConnection.current.onicecandidate = event => {
			if (event.candidate) {
				socketWebRTC.emit(EVENTS.RELAY_ICE, {
					peerID: peerID,
					iceCandidate: event.candidate,
				})
			}
		}

		cameraPeerConnection.current.ontrack = ({ streams: [remoteStream] }) => {
			if (cameraMediaElement.current) {
				cameraMediaElement.current.srcObject = remoteStream
			}
		}
		const offer = await cameraPeerConnection.current.createOffer({
			offerToReceiveAudio: true,
			offerToReceiveVideo: true,
		})
		cameraPeerConnection.current.setLocalDescription(offer)
		socketWebRTC.emit(EVENTS.RELAY_SDP, {
			peerID: peerID,
			sessionDescription: offer,
		})
	}

	const handleRelaySDP = ({
		peerID,
		sessionDescription,
	}: {
		peerID: string
		sessionDescription: RTCSessionDescriptionInit
	}) => {
		if (cameraPeerConnection.current) {
			cameraPeerConnection.current.setRemoteDescription(
				new RTCSessionDescription(sessionDescription)
			)
		}
	}

	const handleRelayICE = ({
		iceCandidate,
	}: {
		iceCandidate: RTCLocalIceCandidateInit
	}) => {
		if (cameraPeerConnection.current) {
			cameraPeerConnection.current.addIceCandidate(
				new RTCIceCandidate(iceCandidate)
			)
		}
	}

	const handleCameraOffline = () => {}

	useEffect(() => {
		socketWebRTC.on(EVENTS.SHARE_CAMERA_PEER_ID, handleAddCameraPeer)
		return () => {
			socketWebRTC.off(EVENTS.SHARE_CAMERA_PEER_ID)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.on(EVENTS.RELAY_SDP, handleRelaySDP)
		return () => {
			socketWebRTC.off(EVENTS.RELAY_SDP)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.on(EVENTS.RELAY_ICE, handleRelayICE)
		return () => {
			socketWebRTC.off(EVENTS.RELAY_ICE)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.on(EVENTS.CAMERA_OFFLINE, handleCameraOffline)
		return () => {
			socketWebRTC.off(EVENTS.CAMERA_OFFLINE)
		}
	}, [])

	useEffect(() => {
		socketWebRTC.emit(EVENTS.JOIN, { roomID: roomID, isCamera: false })
		return () => {
			socketWebRTC.emit(EVENTS.LEAVE, { roomID: roomID })
		}
	}, [roomID])

	const provideMediaRef = useCallback((node: HTMLVideoElement | null) => {
		console.log('установил ноду')

		cameraMediaElement.current = node
	}, [])
	return {
		provideMediaRef,
	}
}
