import { z } from "zod"

const createAccountSchema = z
	.object({
		username: z
			.string()
			.min(3)
			.max(32)
			.regex(/^[A-Za-z][A-Za-z0-9]*$/),
		email: z.string().email(),
		password: z
			.string()
			.min(8)
			.max(100)
			.regex(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/),
		confirmPassword: z.string().min(8),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "The passwords did not match",
				path: ["confirmPassword"],
			})
		}
	})

export type TCreateAccountSchema = z.infer<typeof createAccountSchema>

export default createAccountSchema
