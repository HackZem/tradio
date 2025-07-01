import { ExecutionContext, Logger, OnModuleInit } from "@nestjs/common"
import {
	ConnectedSocket,
	MessageBody,
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets"
import { User } from "@prisma/client"
import { Server, Socket } from "socket.io"

import { RedisService } from "@/src/core/redis/redis.service"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"
import { WsAuthorization } from "@/src/shared/decorators/ws-auth.decorator"
import { WsAuthGuard } from "@/src/shared/guards/ws-auth.guard"

import { GetNotificationsInput } from "./inputs/get-notifications.input"
import { NotificationService } from "./notification.service"

@WebSocketGateway({
	cors: {
		origin: process.env.ALLOWED_ORIGIN,
		credentials: true,
	},
})
export class NotificationGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
	private readonly logger = new Logger(NotificationGateway.name)

	@WebSocketServer()
	private readonly server: Server

	constructor(
		private readonly notificationService: NotificationService,
		private readonly wsAuthGuard: WsAuthGuard,
		private readonly redisService: RedisService,
	) {}

	public async onModuleInit() {
		await this.setupRedisSubscriptions()
	}

	public async handleConnection(client: Socket) {
		try {
			const context = {
				switchToWs: () => ({
					getClient: () => client,
				}),
			} as ExecutionContext

			const isAuthorized = await this.wsAuthGuard.canActivate(context)

			const user = client.data.user as User

			if (!isAuthorized || !user) {
				client.disconnect()
				return
			}

			this.logger.log(`Client has connected | id: ${client.id}`)

			await this.redisService.setUserSocket(user.id, client.id)

			await client.join(`user:${user.id}`)
		} catch (err) {
			client.disconnect()
			this.logger.warn(`Connection rejected: ${err.message}`)
		}
	}

	public async handleDisconnect(client: Socket) {
		try {
			this.logger.log(`Client has disconnected | id: ${client.id}`)

			const user = client.data.user as User

			await this.redisService.deleteUserSocket(user.id)
		} catch (err) {
			this.logger.warn(`Disconnect has errors: ${err.message}`)
		}
	}

	public async sendNotificationToUser(
		userId: string,
		notification: Notification,
	) {
		this.server.to(`user:${userId}`).emit("notification", notification)
	}

	private async setupRedisSubscriptions() {
		await this.redisService.subscriber.psubscribe("notifications:*")

		this.redisService.subscriber.on("pmessage", async (_, channel, message) => {
			try {
				const notification = JSON.parse(message)
				const userId = channel.split(":")[1]

				this.sendNotificationToUser(userId, notification)
			} catch (err) {
				this.logger.error("Error processing notification:", err)
			}
		})
	}
}
