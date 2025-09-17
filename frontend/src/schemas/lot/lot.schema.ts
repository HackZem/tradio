import validator from "validator"
import { z } from "zod"

import { ConditionType, LotType, ReturnType } from "@/graphql/generated/output"

const auctionLotSchema = z.object({
	photos: z.array(
		z.object({
			key: z.string(),

			order: z.number().int(),
		}),
	),
	title: z.string().min(10).max(32),
	type: z.literal(LotType.Auction),
	condition: z.enum(ConditionType),
	country: z.string().refine(validator.isISO31661Alpha2),
	region: z.string(),
	returnPeriod: z.enum(ReturnType),
	price: z.string().refine(v =>
		validator.isDecimal(v, {
			decimal_digits: "0,2",
		}),
	),
	expiresDate: z.date(),
	expiresTime: z.string(),
	categorySlug: z.string(),
	description: z.object({}).loose().optional(),
})

const buynowLotSchema = z.object({
	photos: z.array(
		z.object({
			key: z.string(),

			order: z.number().int(),
		}),
	),
	title: z.string().min(10).max(32),
	type: z.literal(LotType.Buynow),
	condition: z.enum(ConditionType),
	country: z.string().refine(validator.isISO31661Alpha2),
	region: z.string(),
	returnPeriod: z.enum(ReturnType),
	price: z.string().refine(v =>
		validator.isDecimal(v, {
			decimal_digits: "0,2",
		}),
	),
	categorySlug: z.string(),
	description: z.object({}).loose().optional(),
})

const mixedLotSchema = z.object({
	photos: z.array(
		z.object({
			key: z.string(),

			order: z.number().int(),
		}),
	),
	title: z.string().min(10).max(32),
	type: z.literal(LotType.Mixed),
	condition: z.enum(ConditionType),
	country: z.string().refine(validator.isISO31661Alpha2),
	region: z.string(),
	returnPeriod: z.enum(ReturnType),
	price: z.string().refine(v =>
		validator.isDecimal(v, {
			decimal_digits: "0,2",
		}),
	),
	buyNowPrice: z.string().refine(v =>
		validator.isDecimal(v, {
			decimal_digits: "0,2",
		}),
	),
	expiresDate: z.date(),
	expiresTime: z.string(),
	categorySlug: z.string(),
	description: z.object({}).loose().optional(),
})

const lotSchema = z.discriminatedUnion("type", [
	auctionLotSchema,
	buynowLotSchema,
	mixedLotSchema,
])

export type TLotSchema = z.infer<typeof lotSchema>

export default lotSchema
