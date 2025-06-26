import { Field, Float, ID, InputType } from "@nestjs/graphql"
import { Bid } from "@prisma/client"
import { Decimal } from "@prisma/client/runtime/library"

import { UserModel } from "../../auth/account/models/user.model"
import { LotModel } from "../../lot/models/lot.model"

@InputType()
export class BidModel implements Bid {
	@Field(() => ID)
	public id: number

	@Field(() => Float)
	public amount: Decimal

	@Field(() => String)
	public lotId: string

	@Field(() => LotModel)
	public lot: LotModel

	@Field(() => String)
	public userId: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => Date)
	public createdAt: Date
}
