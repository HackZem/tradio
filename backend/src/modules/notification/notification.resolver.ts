import { Args, Query, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"

import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"

import { GetNotificationsInput } from "./inputs/get-notifications.input"
import { NotificationModel } from "./models/notification.model"
import { NotificationService } from "./notification.service"

@Resolver("Notification")
export class NotificationResolver {
	public constructor(
		private readonly notificationService: NotificationService,
	) {}

	@Authorization()
	@Query(() => Number)
	public async findUnreadNotificationsCount(@Authorized("id") userId: string) {
		return this.notificationService.findUnreadCount(userId)
	}

	@Authorization()
	@Query(() => [NotificationModel])
	public async findNotificationByUser(
		@Authorized("id") userId: string,
		@Args("data") input: GetNotificationsInput,
	) {
		return this.notificationService.findByUser(userId, input)
	}
}
