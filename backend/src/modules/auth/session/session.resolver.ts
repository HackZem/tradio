import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql"

import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { UserAgent } from "@/src/shared/decorators/user-agent.decorator"
import type { GqlContext } from "@/src/shared/types/gql-context.types"

import { UserModel } from "../account/models/user.model"

import { LoginInput } from "./inputs/login.input"
import { SessionModel } from "./models/session.model"
import { SessionService } from "./session.service"

@Resolver("Session")
export class SessionResolver {
	public constructor(private readonly sessionService: SessionService) {}

	@Authorization()
	@Query(() => [SessionModel], { name: "findOtherSessionsByUser" })
	public async findOtherByUser(@Context() { req }: GqlContext) {
		return this.sessionService.findOtherByUser(req)
	}

	@Authorization()
	@Query(() => SessionModel, { name: "findCurrentSession" })
	public async findCurrent(@Context() { req }: GqlContext) {
		return this.sessionService.findCurrent(req)
	}

	@Mutation(() => Boolean, { name: "clearSessionCookie" })
	public async clearCookie(@Context() { req }: GqlContext) {
		return this.sessionService.clearCookie(req)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeSession" })
	public async remove(@Context() { req }: GqlContext, @Args("id") id: string) {
		return this.sessionService.remove(req, id)
	}

	@Mutation(() => UserModel, { name: "login" })
	public async login(
		@Context() { req }: GqlContext,
		@Args("data") input: LoginInput,
		@UserAgent() userAgent: string,
	) {
		return this.sessionService.login(req, input, userAgent)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "logout" })
	public async logout(@Context() { req }: GqlContext) {
		return this.sessionService.logout(req)
	}
}
