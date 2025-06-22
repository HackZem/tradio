import { Field, InputType } from "@nestjs/graphql"
import { IsString } from "class-validator"

@InputType()
export class ReorderPhotosInput {
	@Field(() => String)
	@IsString()
	public lotId: string

	@Field(() => [String])
	@IsString({ each: true })
	public photoKeys: string[]
}
