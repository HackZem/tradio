import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { GqlExecutionContext } from "@nestjs/graphql"
import { Request } from "express"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { AUTH_OPTIONS_TOKEN } from "../constants/auth.constants"

export interface AuthorizationOptions {
	isAnonymous?: boolean
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
	private readonly logger = new Logger(GqlAuthGuard.name)

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly reflector: Reflector,
	) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const options =
			this.reflector.get<AuthorizationOptions>(
				AUTH_OPTIONS_TOKEN,
				context.getHandler(),
			) || {}

		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext<{ req: Request }>().req

		const userId = request.session?.userId

		if (!userId) {
			if (options.isAnonymous) return true

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
			if (options.isAnonymous) return true

			this.logger.warn(`Unauthorized access: user ${userId} not found`)
			throw new UnauthorizedException("User is unauthorized")
		}

		;(request as any).user = user
		this.logger.log(`Graphql authenticated for user id: ${user.id}`)

		return true
	}
}
