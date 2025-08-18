import { ArgsType, Field, Int } from "@nestjs/graphql"

@ArgsType()
export class PhotosArgs {
	@Field(() => Int, { nullable: true })
	limit?: number
}
