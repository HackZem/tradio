import { Field, Float, InputType, registerEnumType } from "@nestjs/graphql"
import { ConditionType, LotType } from "@prisma/client"
import {
	IsEnum,
	IsISO31661Alpha2,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Validate,
} from "class-validator"

import { IsCityExistsConstraint } from "@/src/shared/decorators/is-city-constraint.decorator"

export enum SortBy {
	PRICE = "currentPrice",
	BIDS = "bids",
	CREATED_AT = "createdAt",
	EXPIRES_AT = "expiresAt",
}

export enum SortOrder {
	ASC = "asc",
	DESC = "desc",
}

@InputType()
export class PriceRangeInput {
	@Field(() => Float, { nullable: true })
	@IsNumber()
	@IsOptional()
	@IsNotEmpty()
	public min?: number

	@Field(() => Float, { nullable: true })
	@IsNumber()
	@IsOptional()
	@IsNotEmpty()
	public max?: number
}

@InputType()
export class FiltersInput {
	@Field(() => Number, { nullable: true })
	@IsNumber()
	@IsOptional()
	@IsNotEmpty()
	public take?: number

	@Field(() => Number, { nullable: true })
	@IsNumber()
	@IsOptional()
	@IsNotEmpty()
	public skip?: number

	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	public query?: string

	@Field(() => PriceRangeInput, { nullable: true })
	@IsOptional()
	priceRange?: PriceRangeInput

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
	@Validate(IsCityExistsConstraint, [{ isCountryOptional: true }])
	public city?: string

	@Field(() => [LotType], { nullable: true })
	@IsEnum(LotType, { each: true })
	@IsOptional()
	@IsNotEmpty()
	public lotTypes?: LotType[]

	@Field(() => [ConditionType], { nullable: true })
	@IsEnum(ConditionType, { each: true })
	@IsOptional()
	@IsNotEmpty()
	public condition?: ConditionType[]

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsString({ each: true })
	@IsNotEmpty()
	public categoryIds?: string[]

	@Field(() => SortBy, { nullable: true })
	@IsEnum(SortBy)
	@IsOptional()
	@IsNotEmpty()
	public sortBy?: SortBy

	@Field(() => SortOrder, { nullable: true })
	@IsEnum(SortOrder)
	@IsOptional()
	@IsNotEmpty()
	public sortOrder?: SortOrder
}

registerEnumType(LotType, { name: "LotType" })
registerEnumType(ConditionType, { name: "ConditionType" })

registerEnumType(SortBy, { name: "SortBy" })
registerEnumType(SortOrder, { name: "SortOrder" })
