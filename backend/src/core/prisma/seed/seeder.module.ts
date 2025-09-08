import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"

import { BidService } from "@/src/modules/bid/bid.service"
import { S3Service } from "@/src/modules/libs/s3/s3.service"
import { LotQueueService } from "@/src/modules/lot/queues/lot-queue.service"
import { NotificationService } from "@/src/modules/notification/notification.service"

import { getBullConfig } from "../../config/bull.config"
import { RedisService } from "../../redis/redis.service"
import { PrismaService } from "../prisma.service"

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
	providers: [
		RedisService,
		LotQueueService,
		ConfigService,
		PrismaService,
		NotificationService,
		BidService,
		S3Service,
	],
	exports: [
		RedisService,
		LotQueueService,
		ConfigService,
		PrismaService,
		NotificationService,
		BidService,
		S3Service,
	],
})
export class SeederModule {}
