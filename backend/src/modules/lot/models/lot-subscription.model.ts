import { Field, ID, ObjectType } from "@nestjs/graphql"
import { LotSubscription } from "@prisma/client"

import { UserModel } from "../../auth/account/models/user.model"

import { LotModel } from "./lot.model"

@ObjectType()
export class LotSubscriptionModel implements LotSubscription {
	@Field(() => ID)
	public id: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string

	@Field(() => LotModel)
	public lot: LotModel

	@Field(() => String)
	public lotId: string
}
