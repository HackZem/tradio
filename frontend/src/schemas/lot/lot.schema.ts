import validator from "validator"
import { z } from "zod"

import { ConditionType, LotType, ReturnType } from "@/graphql/generated/output"

const lotSchema = z.object({
	photos: z.array(z.string()),
	title: z.string().min(10).max(32),
	type: z.enum(LotType),
	condition: z.enum(ConditionType),
	country: z.string().refine(validator.isISO31661Alpha2),
	region: z.string(),
	returnPeriod: z.enum(ReturnType),
	price: z
		.number()
		.refine(v => validator.isDecimal(v.toString(), { decimal_digits: "2" })),
	buyNowPrice: z
		.number()
		.refine(v => validator.isDecimal(v.toString(), { decimal_digits: "2" }))
		.optional(),
	expiresDate: z.date(),
	expiresTime: z.string(),
	categorySlug: z.string(),
	description: z.json().optional(),
})

export type TLotSchema = z.infer<typeof lotSchema>

export default lotSchema
