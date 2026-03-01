import { useGetUser } from '@/api/hooks'
import { authStore } from '@auth/entities/model/store'
import { type FC, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export const AuthProvider: FC = () => {
	const { data: user, isLoading } = useGetUser()
	const { setUser, setLoading } = authStore()

	useEffect(() => {
		setLoading(isLoading)
		setUser(user ?? null)
	}, [user, isLoading])

	return <Outlet />
}
