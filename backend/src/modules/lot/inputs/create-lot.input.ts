import { Field, Float, InputType, registerEnumType } from "@nestjs/graphql"
import { ConditionType, LotType, ReturnType } from "@prisma/client"
import { JsonObject } from "@prisma/client/runtime/library"
import {
	IsDate,
	IsEnum,
	IsISO31661Alpha2,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Max,
	Validate,
} from "class-validator"
import GraphQLJSON from "graphql-type-json"

import { IsCityExistsConstraint } from "@/src/shared/decorators/is-city-constraint.decorator"
import { IsCUID } from "@/src/shared/decorators/is-cuid.decorator"

@InputType()
export class CreateLotInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(10, 32)
	public title: string

	@Field(() => GraphQLJSON, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Max(1000)
	public description?: JsonObject

	@Field(() => LotType)
	@IsEnum(LotType)
	@IsNotEmpty()
	public type: LotType

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@IsISO31661Alpha2()
	public country: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Validate(IsCityExistsConstraint)
	public city: string

	@Field(() => ReturnType)
	@IsEnum(ReturnType)
	@IsNotEmpty()
	public returnPeriod: ReturnType

	@Field(() => ConditionType)
	@IsEnum(ConditionType)
	@IsNotEmpty()
	public condition: ConditionType

	@Field(() => Float)
	@IsNumber()
	@IsNotEmpty()
	public firstPrice: number

	@Field(() => Date)
	@IsDate()
	@IsNotEmpty()
	public expiresIn: Date

	@Field(() => String)
	@IsCUID()
	@IsNotEmpty()
	public categoryId: string
}

registerEnumType(ReturnType, { name: "ReturnType" })
registerEnumType(ConditionType, { name: "ConditionType" })
registerEnumType(LotType, { name: "LotType" })
