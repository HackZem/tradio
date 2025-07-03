import { BullModuleOptions } from "@nestjs/bull"
import { ConfigService } from "@nestjs/config"

export const getBullConfig = (
	configService: ConfigService,
): BullModuleOptions => {
	return {
		redis: {
			host: configService.getOrThrow<string>("REDIS_HOST"),
			port: configService.getOrThrow<number>("REDIS_PORT"),
			username: configService.getOrThrow<string>("REDIS_USER"),
			password: configService.getOrThrow<string>("REDIS_PASSWORD"),
		},
	}
}
