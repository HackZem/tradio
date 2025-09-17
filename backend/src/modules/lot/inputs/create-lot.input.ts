import { Field, Float, InputType, Int, registerEnumType } from "@nestjs/graphql"
import { ConditionType, LotType, ReturnType } from "@prisma/client"
import { JsonObject } from "@prisma/client/runtime/library"
import { Type } from "class-transformer"
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsDate,
	IsEnum,
	IsISO31661Alpha2,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Length,
	Validate,
	ValidateNested,
} from "class-validator"
import GraphQLJSON from "graphql-type-json"

import { IsRegionExistsConstraint } from "@/src/shared/decorators/is-region-constraint.decorator"

import { UploadPhotoInput } from "./upload-photo.input"

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
	@Validate(IsRegionExistsConstraint)
	public region: string

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
	public price: number

	@Field(() => Float, { nullable: true })
	@IsOptional()
	@IsNumber()
	@IsNotEmpty()
	public buyNowPrice?: number

	@Field(() => Date, { nullable: true })
	@IsOptional()
	@IsDate()
	@IsNotEmpty()
	public expiresAt?: Date

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	public categorySlug: string

	@Field(() => [UploadPhotoInput])
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UploadPhotoInput)
	@ArrayMinSize(1)
	@ArrayMaxSize(10)
	public photos: UploadPhotoInput[]
}

registerEnumType(ReturnType, { name: "ReturnType" })
registerEnumType(ConditionType, { name: "ConditionType" })
registerEnumType(LotType, { name: "LotType" })
