import { Logger } from "@nestjs/common"
import {
	type OnGatewayConnection,
	type OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets"
import * as dotenv from "dotenv"
import { Server, Socket } from "socket.io"

import { NotificationService } from "./notification.service"

dotenv.config()

@WebSocketGateway({
	cors: {
		origin: process.env.ALLOWED_ORIGIN,
	},
})
export class NotificationGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	private readonly logger = new Logger(NotificationGateway.name)

	@WebSocketServer()
	private readonly server: Server

	constructor(private readonly notificationService: NotificationService) {}

	handleConnection(client: Socket) {
		this.logger.log(`Client has connected | id: ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client has disconnected | id: ${client.id}`)
	}
}
