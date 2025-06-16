import { Field, InputType } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

import { IsCUID } from "@/src/shared/decorators/is-cuid.decorator"

@InputType()
export class VerificationInput {
	@Field(() => String)
	@IsCUID()
	@IsNotEmpty()
	public token: string
}
