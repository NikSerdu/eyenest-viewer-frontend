import { z } from 'zod'

export const createLocationSchema = z.object({
	name: z.string().min(1, 'Введите название локации'),
})

export type CreateLocationFormValues = z.infer<typeof createLocationSchema>

