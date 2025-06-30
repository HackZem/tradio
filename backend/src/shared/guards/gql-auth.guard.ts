import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Request } from "express"

import { PrismaService } from "@/src/core/prisma/prisma.service"

@Injectable()
export class GqlAuthGuard implements CanActivate {
	private readonly logger = new Logger(GqlAuthGuard.name)

	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext<{ req: Request }>().req

		const userId = request.session?.userId

		if (!userId) {
			this.logger.warn(`Unauthorized access: no session or userId`)
			throw new UnauthorizedException("User is unauthorized")
		}

		if ((request as any).user) {
			return true
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
		})

		if (!user) {
			this.logger.warn(`Unauthorized access: user ${userId} not found`)
			throw new UnauthorizedException("User is unauthorized")
		}

		;(request as any).user = user
		this.logger.log(`Graphql authenticated for user id: ${user.id}`)

		return true
	}
}
