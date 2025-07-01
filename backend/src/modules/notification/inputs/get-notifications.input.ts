import { Field, InputType } from "@nestjs/graphql"
import { IsNumber, IsOptional } from "class-validator"

@InputType()
export class GetNotificationsInput {
	@Field(() => Number, { nullable: true, defaultValue: 20 })
	@IsOptional()
	@IsNumber()
	take?: number

	@Field(() => Number, { nullable: true, defaultValue: 0 })
	@IsOptional()
	@IsNumber()
	skip?: number
}
