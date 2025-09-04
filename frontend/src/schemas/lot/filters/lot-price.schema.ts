import { z } from "zod"

const lotPriceSchema = (maxPrice: number) =>
	z.object({
		min: z.number().min(0).max(maxPrice).optional(),
		max: z.number().min(0).max(maxPrice).optional(),
	})

export type TLotPriceSchema = z.infer<ReturnType<typeof lotPriceSchema>>

export default lotPriceSchema
