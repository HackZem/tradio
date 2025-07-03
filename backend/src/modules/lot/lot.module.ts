import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"

import { NotificationService } from "../notification/notification.service"

import { LotResolver } from "./lot.resolver"
import { LotService } from "./lot.service"
import { LotEventsProcessor } from "./queues/lot-events.processor"
import { LotQueueService } from "./queues/lot-queue.service"

@Module({
	imports: [
		BullModule.registerQueue({
			name: "lot-events",
			defaultJobOptions: {
				removeOnComplete: true,
				removeOnFail: 100,
			},
		}),
	],
	providers: [
		LotResolver,
		LotService,
		NotificationService,
		LotQueueService,
		LotEventsProcessor,
	],
})
export class LotModule {}
