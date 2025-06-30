import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common"
import { User } from "@prisma/client"
import { type Request } from "express"
import { Socket } from "socket.io"

import { PrismaService } from "@/src/core/prisma/prisma.service"

interface SocketWithSession extends Socket {
	request: Request & { session?: { userId?: string } }
	data: {
		user?: User
		[key: string]: any
	}
}

@Injectable()
export class WsAuthGuard implements CanActivate {
	private readonly logger = new Logger(WsAuthGuard.name)

	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const client = context.switchToWs().getClient<SocketWithSession>()
		const session = client.request.session

		if (!session?.userId) {
			this.logger.warn(`Unauthorized access: no session or userId`)
			throw new UnauthorizedException("User is unauthorized")
		}

		if (client.data.user) {
			return true
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: session.userId,
			},
		})

		if (!user) {
			this.logger.warn(`Unauthorized access: user ${session.userId} not found`)
			throw new UnauthorizedException("User is unauthorized")
		}

		client.data.user = user
		this.logger.log(`WebSocket authenticated for user id: ${user.id}`)

		return true
	}
}
