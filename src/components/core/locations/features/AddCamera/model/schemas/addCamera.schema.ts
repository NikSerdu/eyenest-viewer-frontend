import { z } from 'zod'

export const addCameraSchema = z.object({
	name: z.string().min(1, 'Введите название камеры'),
})

export type AddCameraFormValues = z.infer<typeof addCameraSchema>

