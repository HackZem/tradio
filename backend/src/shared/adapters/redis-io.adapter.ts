import { type INestApplicationContext } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { IoAdapter } from "@nestjs/platform-socket.io"
import { createAdapter } from "@socket.io/redis-adapter"
import { type RequestHandler } from "express"
import { createClient } from "redis"
import { Server, type ServerOptions } from "socket.io"

export class RedisIoAdapter extends IoAdapter {
	private adapterConstructor: ReturnType<typeof createAdapter>

	public constructor(
		private readonly app: INestApplicationContext,
		private readonly sessionMiddleware: RequestHandler,
		private readonly configService: ConfigService,
	) {
		super(app)
	}

	async connectToRedis(): Promise<void> {
		const pubClient = createClient({
			url: this.configService.getOrThrow<string>("REDIS_URI"),
		})
		const subClient = pubClient.duplicate()

		pubClient.on("error", err => {
			console.error("[Redis Publisher] Error", err)
		})
		subClient.on("error", err => {
			console.error("[Redis Subscriber] Error", err)
		})

		await Promise.all([pubClient.connect(), subClient.connect()])

		this.adapterConstructor = createAdapter(pubClient, subClient)
	}

	createIOServer(port: number, options?: ServerOptions): any {
		const server = super.createIOServer(port, options) as Server

		if (!this.adapterConstructor) {
			throw new Error(
				"Redis adapter not initialized. Call connectToRedis() before creating the server.",
			)
		}

		server.adapter(this.adapterConstructor)

		server.engine.use(this.sessionMiddleware)

		return server
	}
}
