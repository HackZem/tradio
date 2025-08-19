import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"

import { LotQueueService } from "@/src/modules/lot/queues/lot-queue.service"

import { getBullConfig } from "../../config/bull.config"
import { RedisService } from "../../redis/redis.service"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getBullConfig,
			inject: [ConfigService],
		}),
		BullModule.registerQueue({
			name: "lot-events",
			defaultJobOptions: {
				removeOnComplete: true,
				removeOnFail: 100,
			},
		}),
	],
	providers: [RedisService, LotQueueService, ConfigService],
	exports: [RedisService, LotQueueService, ConfigService],
})
export class SeederModule {}
