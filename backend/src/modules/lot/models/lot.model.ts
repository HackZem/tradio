import { Field, Float, ID, ObjectType, registerEnumType } from "@nestjs/graphql"
import { ConditionType, Lot, LotType, ReturnType } from "@prisma/client"
import { Decimal, JsonValue } from "@prisma/client/runtime/library"
import GraphQLJSON from "graphql-type-json"

import { UserModel } from "../../auth/account/models/user.model"
import { BidModel } from "../../bid/models/bid.model"
import { CategoryModel } from "../../category/models/category.model"

import { LotPhotoModel } from "./lot-photo.model"
import { LotSubscriptionModel } from "./lot-subscription.model"

@ObjectType()
class LotCount {
	@Field(() => Number)
	bids: number
}

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

	@Field(() => [LotPhotoModel])
	public photos: LotPhotoModel[]

	@Field(() => LotType)
	public type: LotType

	@Field(() => Boolean)
	public isActive: boolean

	@Field(() => Float, { nullable: true })
	public currentPrice: Decimal

	@Field(() => Float, { nullable: true })
	public firstPrice: Decimal

	@Field(() => Float, { nullable: true })
	public buyNowPrice: Decimal

	@Field(() => Date, { nullable: true })
	public expiresAt: Date

	@Field(() => Number, { defaultValue: 0 })
	public views: number

	@Field(() => String)
	public country: string

	@Field(() => String)
	public region: string

	@Field(() => ReturnType)
	public returnPeriod: ReturnType

	@Field(() => ConditionType)
	public condition: ConditionType

	@Field(() => [LotSubscriptionModel])
	public subscriptions: LotSubscriptionModel[]

	@Field(() => [BidModel])
	public bids: BidModel[]

	@Field(() => CategoryModel)
	public category: CategoryModel

	@Field(() => String)
	public categorySlug: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => String)
	public userId: string

	@Field(() => Boolean)
	public isSubscribed: boolean

	@Field(() => LotCount)
	public _count: LotCount
}

registerEnumType(LotType, { name: "LotType" })
registerEnumType(ReturnType, { name: "ReturnType" })
registerEnumType(ConditionType, { name: "ConditionType" })
