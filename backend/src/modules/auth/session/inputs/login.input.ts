import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from "class-validator"

@InputType()
export class LoginInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	public login: string

	@Field()
	@IsString()
	@IsNotEmpty()
	//@Matches(/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/)
	@Length(8, 100)
	public password: string
}
