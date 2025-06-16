import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"

import { PrismaService } from "@/src/core/prisma/prisma.service"

@Injectable()
export class GqlAuthGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext().req

		const userId = request.session.userId

		if (typeof userId === "undefined") {
			throw new UnauthorizedException("User is unauthorized")
		}

		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId,
			},
		})

		request.user = user

		return true
	}
}
