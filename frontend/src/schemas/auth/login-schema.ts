import { z } from "zod"

const loginSchema = z.object({
	login: z.string().min(3),
	password: z
		.string()
		.min(8)
		.max(100)
		.regex(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/),
})

export type TLoginSchema = z.infer<typeof loginSchema>

export default loginSchema
