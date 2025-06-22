import { Field, ID, ObjectType } from "@nestjs/graphql"
import type { User } from "@prisma/client"

import { LotModel } from "@/src/modules/lot/models/lot.model"

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	public id: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date

	@Field(() => String)
	public email: string

	@Field(() => String)
	public password: string

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
	public city: string

	@Field(() => Boolean, { defaultValue: false })
	public isVerified: boolean

	@Field(() => Boolean, { defaultValue: false })
	public isEmailVerified: boolean

	@Field(() => [LotModel])
	public lots: boolean[]
}
