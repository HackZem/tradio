import { ExecutionContext, Logger } from "@nestjs/common"
import {
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

import { NotificationService } from "./notification.service"

@WebSocketGateway({
	cors: {
		origin: process.env.ALLOWED_ORIGIN,
		credentials: true,
	},
})
export class NotificationGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(NotificationGateway.name)

	@WebSocketServer()
	private readonly server: Server

	constructor(
		private readonly notificationService: NotificationService,
		private readonly wsAuthGuard: WsAuthGuard,
		private readonly redisService: RedisService,
	) {}

	async handleConnection(client: Socket) {
		try {
			const context = {
				switchToWs: () => ({
					getClient: () => client,
				}),
			} as ExecutionContext

			const isAuthorized = await this.wsAuthGuard.canActivate(context)

			if (!isAuthorized) {
				client.disconnect()
				return
			}

			this.logger.log(`Client has connected | id: ${client.id}`)
		} catch (error) {
			client.disconnect()
			this.logger.warn(`Connection rejected: ${error.message}`)
		}
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client has disconnected | id: ${client.id}`)
	}

	@SubscribeMessage("events")
	@WsAuthorization()
	handleEvent(@MessageBody() data: string, @Authorized() user: User): User {
		console.log(data)
		return user
	}
}
