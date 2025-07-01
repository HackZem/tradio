import { Injectable } from "@nestjs/common"
import { NotificationType, Prisma } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { RedisService } from "@/src/core/redis/redis.service"

import { CreateNotificationInput } from "./inputs/create-notification.input"
import { GetNotificationsInput } from "./inputs/get-notifications.input"

@Injectable()
export class NotificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
	) {}

	private createNotificationData(input: CreateNotificationInput) {
		const { userId, ...notificationData } = input

		return {
			...notificationData,
			user: {
				connect: {
					id: userId,
				},
			},
		}
	}

	public async create(input: CreateNotificationInput) {
		const notification = await this.prismaService.notification.create({
			data: this.createNotificationData(input),
		})

		await this.redisService.publishNotification(input.userId, notification)

		return notification
	}

	public async findByUser(
		userId: string,
		{ take, skip }: GetNotificationsInput,
	) {
		const notifications = await this.prismaService.notification.findMany({
			where: {
				userId,
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

		return notifications
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

	public async notifyNewBid(lotId: string, bidderId: string, amount: number) {
		const lot = await this.prismaService.lot.findUnique({
			where: {
				id: lotId,
			},
			select: {
				title: true,
				userId: true,
				bids: {
					select: {
						userId: true,
						amount: true,
					},
					orderBy: {
						createdAt: "desc",
					},
				},
				subscriptions: {
					select: {
						userId: true,
					},
				},
			},
		})

		if (!lot) {
			return false
		}

		const notificationaData: Prisma.NotificationCreateInput[] = []

		notificationaData.push(
			this.createNotificationData({
				title: "New Bid!",
				description: `New bid ${amount} on your lot ${lot.title}`,
				isRead: false,
				type: NotificationType.NEW_BID,
				userId: lot.userId!,
			}),
		)

		notificationaData.push(
			...lot.subscriptions
				.filter(subscription => subscription.userId !== bidderId)
				.map(subscription => {
					if (subscription.userId === lot.bids[1].userId) {
						return this.createNotificationData({
							title: "Your bid has been outbid",
							description: `Your bid of ${lot.bids[1].amount} has been outbid. The new bid is ${amount}.`,
							isRead: false,
							type: NotificationType.NEW_BID,
							userId: subscription.userId,
						})
					} else {
						return this.createNotificationData({
							title: "New Bid!",
							description: `New bid ${amount} on lot ${lot.title}`,
							isRead: false,
							type: NotificationType.NEW_BID,
							userId: subscription.userId,
						})
					}
				}),
		)

		const notifications =
			await this.prismaService.notification.createManyAndReturn({
				data: notificationaData.map(({ user, ...data }) => ({
					...data,
					userId: user?.connect?.id!,
				})),
			})

		notifications.forEach(
			async notification =>
				await this.redisService.publishNotification(
					notification.userId,
					notification,
				),
		)

		return true
	}
}
