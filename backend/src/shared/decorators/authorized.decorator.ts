import { createParamDecorator, type ExecutionContext } from "@nestjs/common"
import { GqlExecutionContext } from "@nestjs/graphql"
import type { User } from "@prisma/client"

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		let user: User | undefined

		if (ctx.getType() === "http") {
			user = ctx.switchToHttp().getRequest().user
		} else if (ctx.getType() === "ws") {
			const client = ctx.switchToWs().getClient()
			user = client.data.user
		} else {
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext().req.user
		}

		return data ? user?.[data] : user
	},
)
