import { Field, Float, ObjectType } from "@nestjs/graphql"

import { LotModel } from "./lot.model"

@ObjectType()
export class FindLotsModel {
	@Field(() => [LotModel])
	lots: LotModel[]

	@Field(() => Float, { nullable: true })
	maxPrice?: number
}
