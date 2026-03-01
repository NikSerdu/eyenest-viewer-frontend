export type AuthType = 'sign-in' | 'sign-up'

export interface AuthFormData {
	fullName: string
	email: string
	password: string
	confirmPassword?: string
}

export interface AuthState {
	authType: AuthType
	showPassword: boolean
	isLoading: boolean
	error: string | null
}
