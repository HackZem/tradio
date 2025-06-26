import { Field, Float, ID, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Bid, ConditionType, Lot, LotType, ReturnType } from "@prisma/client"
import { Decimal, JsonValue } from "@prisma/client/runtime/library"
import GraphQLJSON from "graphql-type-json"

import { UserModel } from "../../auth/account/models/user.model"
import { CategoryModel } from "../../category/models/category.model"

import { LotSubscriptionModel } from "./lot-subscription.model"

@ObjectType()
export class LotModel implements Lot {
	@Field(() => ID)
	public id: string

	@Field(() => Date)
	public createdAt: Date

	@Field(() => Date)
	public updatedAt: Date

	@Field(() => String)
	public title: string

	@Field(() => GraphQLJSON, { nullable: true })
	public description: JsonValue

	@Field(() => [String])
	public photos: string[]

	@Field(() => LotType)
	public type: LotType

	@Field(() => Float, { nullable: true })
	public currentPrice: Decimal

	@Field(() => Float, { nullable: true })
	public firstPrice: Decimal

	@Field(() => Float, { nullable: true })
	public buyNowPrice: Decimal

	@Field(() => Date, { nullable: true })
	public expiresIn: Date

	@Field(() => Number, { defaultValue: 0 })
	public views: number

	@Field(() => String)
	public country: string

	@Field(() => String)
	public city: string

	@Field(() => ReturnType)
	public returnPeriod: ReturnType

	@Field(() => ConditionType)
	public condition: ConditionType

	@Field(() => [LotSubscriptionModel])
	public subscriptions: LotSubscriptionModel[]

	@Field(() => CategoryModel)
	category: CategoryModel

	@Field(() => String)
	categoryId: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string
}

registerEnumType(LotType, { name: "LotType" })
registerEnumType(ReturnType, { name: "ReturnType" })
registerEnumType(ConditionType, { name: "ConditionType" })
