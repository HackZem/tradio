import validator from "validator"
import { z } from "zod"

const changeInfoSchema = z.object({
	username: z
		.string()
		.min(3)
		.max(32)
		.regex(/^[A-Za-z][A-Za-z0-9]*$/),
	description: z.string().max(1000),
	phone: z
		.string()
		.refine(validator.isMobilePhone, { message: "Invalid phone number" }),
	country: z.string().refine(validator.isISO31661Alpha2),
	region: z.string(),
})

export type TChangeInfoSchema = z.infer<typeof changeInfoSchema>

export default changeInfoSchema
