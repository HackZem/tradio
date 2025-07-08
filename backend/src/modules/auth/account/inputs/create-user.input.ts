import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator"

import { Match } from "@/src/shared/decorators/match.decorator"

@InputType()
export class CreateUserInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[A-Za-z][A-Za-z0-9]*$/)
	@Length(3, 32)
	public username: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	public email: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/)
	@Length(8, 100)
	public password: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Match("password", { message: "Passwords must match" })
	public confirmPassword: string
}
