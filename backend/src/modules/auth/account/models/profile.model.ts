import { Field, ID, ObjectType } from "@nestjs/graphql"

import { LotModel } from "@/src/modules/lot/models/lot.model"

@ObjectType()
export class UserProfileModel {
	@Field(() => ID)
	public id: string

	@Field(() => Date)
	public updatedAt: Date

	@Field(() => String)
	public username: string

	@Field(() => String, { nullable: true })
	public avatar: string

	@Field(() => String, { nullable: true })
	public description: string

	@Field(() => String, { nullable: true })
	public phone: string

	@Field(() => String, { nullable: true })
	public country: string

	@Field(() => String, { nullable: true })
	public region: string

	@Field(() => Boolean, { defaultValue: false })
	public isVerified: boolean

	@Field(() => [LotModel])
	public lots: LotModel[]
}
