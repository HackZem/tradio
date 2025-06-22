import { Field, InputType } from "@nestjs/graphql"
import { IsString } from "class-validator"

@InputType()
export class UploadPhotoInput {
	@Field(() => String)
	@IsString()
	public lotId: string
}
