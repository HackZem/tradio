import { Injectable, OnModuleInit } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { Notification } from "@prisma/client"
import Redis, { type RedisOptions } from "ioredis"

@Injectable()
export class RedisService extends Redis implements OnModuleInit {
	public publisher: Redis
	public subscriber: Redis

	public constructor(private readonly configService: ConfigService) {
		super(configService.getOrThrow<string>("REDIS_URI"))
	}

	public onModuleInit() {
		const redisConfig: RedisOptions = {
			maxRetriesPerRequest: 3,
			retryStrategy: (attempts: number) => {
				return Math.min(attempts * 100, 3000)
			},
		}

		this.publisher = new Redis(
			this.configService.getOrThrow<string>("REDIS_URI"),
			redisConfig,
		)
		this.subscriber = new Redis(
			this.configService.getOrThrow<string>("REDIS_URI"),
			redisConfig,
		)
	}

	public async publishNotification(userId: string, notification: Notification) {
		await this.publisher.publish(
			`notifications:${userId}`,
			JSON.stringify(notification),
		)
	}

	public async setUserSocket(userId: string, socketId: string) {
		await this.publisher.hset("user:socket", userId, socketId)
	}

	public async deleteUserSocket(userId: string) {
		await this.publisher.hdel("user:socket", userId)
	}

	public async getUserSocket(userId: string) {
		return await this.publisher.hget("user:socket", userId)
	}
}
