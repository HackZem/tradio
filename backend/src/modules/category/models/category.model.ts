import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Category } from "@prisma/client"

import { LotModel } from "../../lot/models/lot.model"

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	public id: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date

	@Field(() => String)
	public title: string

	@Field(() => String)
	public slug: string

	@Field(() => [LotModel])
	public lots: LotModel[]
}
