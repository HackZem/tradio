import { ApolloDriver } from "@nestjs/apollo"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { GraphQLModule } from "@nestjs/graphql"

import { AccountModule } from "../modules/auth/account/account.module"
import { ProfileModule } from "../modules/auth/profile/profile.module"
import { SessionModule } from "../modules/auth/session/session.module"
import { VerificationModule } from "../modules/auth/verification/verification.module"
import { BidModule } from "../modules/bid/bid.module"
import { CategoryModule } from "../modules/category/category.module"
import { MailModule } from "../modules/libs/mail/mail.module"
import { S3Module } from "../modules/libs/s3/s3.module"
import { LotModule } from "../modules/lot/lot.module"
import { IS_DEV_ENV } from "../shared/utils/is-dev.util"

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
		S3Module,
		MailModule,
		AccountModule,
		ProfileModule,
		LotModule,
		BidModule,
		SessionModule,
		VerificationModule,
		CategoryModule,
	],
	controllers: [],
	providers: [],
})
export class CoreModule {}
