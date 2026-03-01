import { create } from 'zustand'
import type { IUser } from '../types'

type AuthStore = {
	user: IUser | null
	isLoading: boolean
	setUser: (user: IUser | null) => void
	setLoading: (loading: boolean) => void
}

export const authStore = create<AuthStore>()(set => ({
	user: null,
	isLoading: true,
	setUser: user => set({ user }),
	setLoading: isLoading => set({ isLoading }),
}))
