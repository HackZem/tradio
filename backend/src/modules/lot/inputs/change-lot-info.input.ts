import { Field, InputType, registerEnumType } from "@nestjs/graphql"
import { ConditionType, ReturnType } from "@prisma/client"
import { JsonValue } from "@prisma/client/runtime/library"
import {
	IsEnum,
	IsISO31661Alpha2,
	IsJSON,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
	Max,
	Validate,
} from "class-validator"

import { IsCityExistsConstraint } from "@/src/shared/decorators/is-city-constraint.decorator"

@InputType()
export class ChangeLotInfoInput {
	@Field()
	@IsString()
	public lotId: string

	@Field()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Length(10, 32)
	public title: string

	@Field()
	@IsOptional()
	@IsJSON()
	@IsNotEmpty()
	@Max(1000)
	public description: JsonValue

	@Field()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@IsISO31661Alpha2()
	public country: string

	@Field()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Validate(IsCityExistsConstraint)
	public city: string

	@Field()
	@IsOptional()
	@IsEnum(ReturnType)
	@IsNotEmpty()
	public returnPeriod: ReturnType

	@Field()
	@IsOptional()
	@IsEnum(ConditionType)
	@IsNotEmpty()
	public condition: ConditionType
}

registerEnumType(ReturnType, { name: "ReturnType" })
registerEnumType(ConditionType, { name: "ConditionType" })
