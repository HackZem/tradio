import { Field, ID, ObjectType } from "@nestjs/graphql"
import type { User } from "@prisma/client"

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

	@Field(() => Boolean, { defaultValue: false })
	isVerified: boolean

	@Field(() => Boolean, { defaultValue: false })
	isEmailVerified: boolean
}
