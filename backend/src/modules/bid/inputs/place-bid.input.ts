import { Field, Float, InputType } from "@nestjs/graphql"
import { IsNotEmpty, IsNumber } from "class-validator"

import { IsCUID } from "@/src/shared/decorators/is-cuid.decorator"

@InputType()
export class PlaceBidInput {
	@Field(() => String)
	@IsCUID()
	@IsNotEmpty()
	public lotId: string

	@Field(() => Float)
	@IsNumber()
	@IsNotEmpty()
	public amount: number
}
