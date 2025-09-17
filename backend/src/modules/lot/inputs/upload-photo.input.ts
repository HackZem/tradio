import { Field, InputType, Int } from "@nestjs/graphql"
import { IsOptional, IsString } from "class-validator"
import { FileUpload, GraphQLUpload } from "graphql-upload-ts"

@InputType()
export class UploadPhotoInput {
	@Field(() => String, { nullable: true })
	@IsString()
	@IsOptional()
	public key?: string

	@Field(() => GraphQLUpload, { nullable: true })
	@IsOptional()
	public file?: FileUpload

	@Field(() => Int)
	public order: number
}
