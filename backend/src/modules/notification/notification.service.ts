import { Injectable, Logger } from "@nestjs/common"
import { NotificationType, Prisma } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { RedisService } from "@/src/core/redis/redis.service"

import { CreateNotificationInput } from "./inputs/create-notification.input"
import { GetNotificationsInput } from "./inputs/get-notifications.input"

@Injectable()
export class NotificationService {
	private readonly logger = new Logger(NotificationService.name)

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
				title: "New Bid",
				description: `New bid ${amount}€ on your lot ${lot.title}`,
				isRead: false,
				type: NotificationType.NEW_BID,
				userId: lot.userId!,
			}),
		)

		const previousBid = lot.bids[1]

		const subscriberNotifications = lot.subscriptions
			.filter(subscription => subscription.userId !== bidderId)
			.map(({ userId }) => {
				const isOutbid = userId === previousBid.userId

				const title = isOutbid ? "Your bid has been outbid" : "New Bid"

				const description = isOutbid
					? `Your bid of ${previousBid.amount} has been outbid. The new bid is ${amount}€`
					: `New bid ${amount}€ on lot ${lot.title}`

				return this.createNotificationData({
					title,
					description,
					isRead: false,
					type: NotificationType.NEW_BID,
					userId,
				})
			})

		notificationaData.push(...subscriberNotifications)

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

	public async notifyLotEnding(lotId: string, minutes: number) {
		if (minutes < 0) {
			this.logger.error("Minutes should be positive")
			return
		}

		const lot = await this.prismaService.lot.findUnique({
			where: {
				id: lotId,
			},
			select: {
				title: true,
				userId: true,
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
				title: "Lot Ending",
				description: `Your lot ${lot.title} ends in ${minutes}`,
				isRead: false,
				type: NotificationType.LOT_ENDING,
				userId: lot.userId!,
			}),
		)

		const subscriberNotifications = lot.subscriptions.map(({ userId }) =>
			this.createNotificationData({
				title: "Lot Ending",
				description: `Lot ${lot.title} ends in ${minutes}`,
				isRead: false,
				type: NotificationType.LOT_ENDING,
				userId,
			}),
		)

		notificationaData.push(...subscriberNotifications)

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

	public async notifyLotEnded(lotId: string) {
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

		const wonBid = lot.bids[0]

		const notificationaData: Prisma.NotificationCreateInput[] = []

		notificationaData.push(
			this.createNotificationData({
				title: "Lot Ended",
				description: `Your lot ${lot.title} ended at the amount of ${wonBid.amount}€`,
				isRead: false,
				type: NotificationType.LOT_ENDED,
				userId: lot.userId!,
			}),
		)

		const bidderIdsSet = new Set(lot.subscriptions.map(({ userId }) => userId))

		const bidderNotifications = lot.subscriptions
			.filter(({ userId }) => bidderIdsSet.has(userId))
			.map(({ userId }) => {
				const isWon = userId === wonBid.userId

				const title = isWon ? "You won" : "You lost"

				const description = isWon
					? `You won the lot ${lot.title} for ${wonBid.amount}€`
					: `You lost the lot ${lot.title}`

				return this.createNotificationData({
					title,
					description,
					isRead: false,
					type: isWon ? NotificationType.LOT_WON : NotificationType.LOT_LOST,
					userId,
				})
			})

		const subscriberNotifications = lot.subscriptions
			.filter(({ userId }) => !bidderIdsSet.has(userId))
			.map(({ userId }) => {
				return this.createNotificationData({
					title: "Lot Ended",
					description: `The lot ${lot.title} ended at the amount of ${wonBid.amount}€`,
					isRead: false,
					type: NotificationType.LOT_ENDED,
					userId,
				})
			})

		notificationaData.push(...bidderNotifications)
		notificationaData.push(...subscriberNotifications)

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
