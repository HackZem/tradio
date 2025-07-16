import { Module } from "@nestjs/common"

import { WsAuthGuard } from "@/src/shared/guards/ws-auth.guard"

import { NotificationGateway } from "./notification.gateway"
import { NotificationResolver } from "./notification.resolver"
import { NotificationService } from "./notification.service"

@Module({
	providers: [
		NotificationGateway,
		NotificationResolver,
		NotificationService,
		WsAuthGuard,
	],
})
export class NotificationModule {}
