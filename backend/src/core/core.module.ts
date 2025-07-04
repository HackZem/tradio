import { ApolloDriver } from "@nestjs/apollo"
import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"
import { ScheduleModule } from "@nestjs/schedule"

import { AccountModule } from "../modules/auth/account/account.module"
import { ProfileModule } from "../modules/auth/profile/profile.module"
import { SessionModule } from "../modules/auth/session/session.module"
import { VerificationModule } from "../modules/auth/verification/verification.module"
import { BidModule } from "../modules/bid/bid.module"
import { CategoryModule } from "../modules/category/category.module"
import { CronModule } from "../modules/cron/cron.module"
import { MailModule } from "../modules/libs/mail/mail.module"
import { S3Module } from "../modules/libs/s3/s3.module"
import { LotModule } from "../modules/lot/lot.module"
import { NotificationModule } from "../modules/notification/notification.module"
import { IS_DEV_ENV } from "../shared/utils/is-dev.util"

import { getBullConfig } from "./config/bull.config"
import { getGraphQLConfig } from "./config/graphql.config"
import { PrismaModule } from "./prisma/prisma.module"
import { RedisModule } from "./redis/redis.module"

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			ignoreEnvFile: !IS_DEV_ENV,
		}),
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService],
		}),
		PrismaModule,
		RedisModule,
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getBullConfig,
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),
		S3Module,
		MailModule,
		CronModule,
		AccountModule,
		ProfileModule,
		LotModule,
		BidModule,
		SessionModule,
		VerificationModule,
		CategoryModule,
		NotificationModule,
	],
	controllers: [],
	providers: [],
})
export class CoreModule {}
