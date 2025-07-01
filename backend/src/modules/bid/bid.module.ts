import { Module } from "@nestjs/common"

import { NotificationService } from "../notification/notification.service"

import { BidResolver } from "./bid.resolver"
import { BidService } from "./bid.service"

@Module({
	providers: [BidResolver, BidService, NotificationService],
})
export class BidModule {}
