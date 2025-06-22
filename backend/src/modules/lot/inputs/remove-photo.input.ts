import { Field, InputType } from "@nestjs/graphql"
import { IsString } from "class-validator"

@InputType()
export class RemovePhotoInput {
	@Field(() => String)
	@IsString()
	public lotId: string

	@Field(() => String)
	@IsString()
	public photoKey: string
}
