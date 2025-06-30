import { Injectable } from "@nestjs/common"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { RedisService } from "@/src/core/redis/redis.service"

import { CreateNotificationInput } from "./inputs/create-notification.input"

@Injectable()
export class NotificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
	) {}

	public async create(input: CreateNotificationInput) {
		const { userId, ...notificationData } = input
		const notification = await this.prismaService.notification.create({
			data: {
				...notificationData,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})

		await this.redisService.publishNotification(userId, notification)

		return notification
	}

	public async findByUser(userId: string, take: number = 20, skip: number = 0) {
		const result = await this.prismaService.$transaction(async tx => {
			const notifications = await tx.notification.findMany({
				where: {
					userId,
					isRead: false,
				},
				orderBy: {
					createdAt: "desc",
				},
				take,
				skip,
				include: {
					user: {
						select: {
							id: true,
							username: true,
						},
					},
				},
			})

			await tx.notification.updateMany({
				where: {
					userId,
					isRead: false,
				},
				data: {
					isRead: true,
				},
			})

			return notifications
		})

		return result
	}

	public async findUnreadCount(userId: string) {
		const notificationCount = await this.prismaService.notification.count({
			where: {
				userId,
				isRead: false,
			},
		})

		return notificationCount
	}

	//TODO: create more point notifications
}
