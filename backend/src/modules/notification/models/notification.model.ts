import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Notification, NotificationType } from "@prisma/client"

import { UserModel } from "../../auth/account/models/user.model"

@ObjectType()
export class NotificationModel implements Notification {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public title: string

	@Field(() => String)
	public description: string

	@Field(() => Boolean)
	public isRead: boolean

	@Field(() => NotificationType)
	public type: NotificationType

	@Field(() => String)
	public userId: string

	@Field(() => UserModel)
	public user: UserModel

	@Field(() => Date)
	public createdAt: Date
}

registerEnumType(NotificationType, { name: "NotificationType" })
