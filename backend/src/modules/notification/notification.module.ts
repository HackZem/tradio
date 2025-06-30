import { Module } from "@nestjs/common"

import { WsAuthGuard } from "@/src/shared/guards/ws-auth.guard"

import { NotificationGateway } from "./notification.gateway"
import { NotificationService } from "./notification.service"

@Module({
	providers: [NotificationGateway, NotificationService, WsAuthGuard],
})
export class NotificationModule {}
