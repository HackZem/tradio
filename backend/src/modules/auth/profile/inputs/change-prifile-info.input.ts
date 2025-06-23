import { Field, InputType } from "@nestjs/graphql"
import {
	IsISO31661Alpha2,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Length,
	Matches,
	Validate,
} from "class-validator"

import { IsCityExistsConstraint } from "@/src/shared/decorators/is-city-constraint.decorator"

@InputType()
export class ChangeProfileInfoInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[A-Za-z][A-Za-z0-9]*$/)
	@Length(3, 32)
	public username?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@IsPhoneNumber()
	public phone?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Length(2, 500)
	public description?: string

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
	@Validate(IsCityExistsConstraint)
	public city?: string
}
