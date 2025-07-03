import {
	ExecutionContext,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common"
import {
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets"
import { User } from "@prisma/client"
import { Server, Socket } from "socket.io"

import { RedisService } from "@/src/core/redis/redis.service"
import { WsAuthGuard } from "@/src/shared/guards/ws-auth.guard"

@WebSocketGateway({
	cors: {
		origin: process.env.ALLOWED_ORIGIN,
		credentials: true,
	},
})
export class NotificationGateway
	implements
		OnGatewayConnection,
		OnGatewayDisconnect,
		OnModuleInit,
		OnModuleDestroy
{
	private readonly logger = new Logger(NotificationGateway.name)

	@WebSocketServer()
	private readonly server: Server

	constructor(
		private readonly wsAuthGuard: WsAuthGuard,
		private readonly redisService: RedisService,
	) {}

	public async onModuleInit() {
		await this.redisService.deleteAllUserSockets()
		await this.setupRedisSubscriptions()
	}

	public async onModuleDestroy() {
		await this.redisService.deleteAllUserSockets()
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
