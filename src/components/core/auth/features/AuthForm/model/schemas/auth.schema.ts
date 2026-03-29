import { z } from 'zod'

export const registerSchema = z
	.object({
		email: z.string().min(1, 'Введите email').email('Некорректный email'),
		password: z.string().min(6, 'Минимум 6 символов'),
		confirmPassword: z.string().min(6, 'Подтвердите пароль'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Пароли должны совпадать',
		path: ['confirmPassword'],
	})

export const loginSchema = z.object({
	email: z.string().min(1, 'Введите email').email('Некорректный email'),
	password: z.string().min(6, 'Минимум 6 символов'),
})

export const otpSchema = z.object({
	code: z
		.string()
		.length(6, 'Код — 6 цифр')
		.regex(/^\d{6}$/, 'Только цифры'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type OtpFormValues = z.infer<typeof otpSchema>
