import { Field, InputType, registerEnumType } from "@nestjs/graphql"
import { Notification, NotificationType } from "@prisma/client"
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	Length,
} from "class-validator"

import { IsCUID } from "@/src/shared/decorators/is-cuid.decorator"

@InputType()
export class CreateNotificationInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@Length(2, 20)
	public title: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	@Length(2, 40)
	public description: string

	@Field(() => Boolean, { defaultValue: false })
	@IsBoolean()
	public isRead: boolean

	@Field(() => NotificationType, { defaultValue: NotificationType.OTHER })
	@IsEnum(NotificationType)
	public type: NotificationType

	@Field(() => String)
	@IsCUID()
	@IsNotEmpty()
	public userId: string
}

registerEnumType(NotificationType, { name: "NotificationType" })
