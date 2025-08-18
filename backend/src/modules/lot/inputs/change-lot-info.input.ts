import { Field, Float, InputType, registerEnumType } from "@nestjs/graphql"
import { ConditionType, LotType, ReturnType } from "@prisma/client"
import { JsonObject } from "@prisma/client/runtime/library"
import {
	IsDate,
	IsEnum,
	IsISO31661Alpha2,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Length,
	Max,
	Validate,
} from "class-validator"
import GraphQLJSON from "graphql-type-json"

import { IsCUID } from "@/src/shared/decorators/is-cuid.decorator"
import { IsRegionExistsConstraint } from "@/src/shared/decorators/is-region-constraint.decorator"

@InputType()
export class ChangeLotInfoInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public lotId: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Length(10, 32)
	public title?: string

	@Field(() => GraphQLJSON, { nullable: true })
	@IsOptional()
	@IsObject()
	@IsNotEmpty()
	@Max(1000)
	public description?: JsonObject

	@Field(() => LotType, { nullable: true })
	@IsOptional()
	@IsEnum(LotType)
	@IsNotEmpty()
	public type?: LotType

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@IsISO31661Alpha2()
	public country?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Validate(IsRegionExistsConstraint)
	public region?: string

	@Field(() => ReturnType, { nullable: true })
	@IsOptional()
	@IsEnum(ReturnType)
	@IsNotEmpty()
	public returnPeriod?: ReturnType

	@Field(() => ConditionType, { nullable: true })
	@IsOptional()
	@IsEnum(ConditionType)
	@IsNotEmpty()
	public condition?: ConditionType

	@Field(() => Float, { nullable: true })
	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	public firstPrice: number

	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDate()
	@IsNotEmpty()
	public expiresAt: Date

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsCUID()
	@IsNotEmpty()
	public categorySlug?: string
}

registerEnumType(ReturnType, { name: "ReturnType" })
registerEnumType(ConditionType, { name: "ConditionType" })
registerEnumType(LotType, { name: "LotType" })
