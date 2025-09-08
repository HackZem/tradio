import { Injectable, Logger } from "@nestjs/common"
import { NotificationType, Prisma } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { RedisService } from "@/src/core/redis/redis.service"

import { CreateNotificationInput } from "./inputs/create-notification.input"
import { GetNotificationsInput } from "./inputs/get-notifications.input"
import { NOTIFICATIONS } from "./notifications"

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

		await this.prismaService.notification.updateMany({
			where: {
				userId,
				isRead: false,
			},
			data: {
				isRead: true,
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
			this.createNotificationData(
				NOTIFICATIONS.newBid.toAutor(amount, lot.title, lot.userId!),
			),
		)

		const previousBid = lot.bids[1]

		const subscriberNotifications = lot.subscriptions
			.filter(subscription => subscription.userId !== bidderId)
			.map(({ userId }) => {
				const isOutbid = userId === previousBid.userId

				const data = isOutbid
					? NOTIFICATIONS.newBid.toOutbidUser(
							previousBid.amount.toNumber(),
							amount,
							lot.title,
							userId,
						)
					: NOTIFICATIONS.newBid.toUser(amount, lot.title, userId)

				return this.createNotificationData(data)
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
			this.createNotificationData(
				NOTIFICATIONS.lotEnding.toAutor(minutes, lot.title, lot.userId!),
			),
		)

		const subscriberNotifications = lot.subscriptions.map(({ userId }) =>
			this.createNotificationData(
				NOTIFICATIONS.lotEnding.toUser(minutes, lot.title, userId),
			),
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

		const notificationData: Prisma.NotificationCreateInput[] = []

		notificationData.push(
			this.createNotificationData(
				NOTIFICATIONS.lotEnded.toAutor(
					wonBid.amount?.toNumber() ?? 0,
					lot.title,
					lot.userId!,
				),
			),
		)

		const bidderIdsSet = new Set(lot.subscriptions.map(({ userId }) => userId))

		const bidderNotifications = lot.subscriptions
			.filter(({ userId }) => bidderIdsSet.has(userId))
			.map(({ userId }) => {
				const isWon = userId === wonBid.userId

				const data = isWon
					? NOTIFICATIONS.lotEnded.toWonUser(
							wonBid.amount.toNumber(),
							lot.title,
							userId,
						)
					: NOTIFICATIONS.lotEnded.toLostUser(
							wonBid.amount.toNumber(),
							lot.title,
							userId,
						)

				return this.createNotificationData(data)
			})

		const subscriberNotifications = lot.subscriptions
			.filter(({ userId }) => !bidderIdsSet.has(userId))
			.map(({ userId }) => {
				return this.createNotificationData(
					NOTIFICATIONS.lotEnded.toUser(
						wonBid.amount?.toNumber() ?? 0,
						lot.title,
						userId,
					),
				)
			})

		notificationData.push(...bidderNotifications)
		notificationData.push(...subscriberNotifications)

		const notifications =
			await this.prismaService.notification.createManyAndReturn({
				data: notificationData.map(({ user, ...data }) => ({
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
