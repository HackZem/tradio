import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"

import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"

import { AccountService } from "./account.service"
import { CreateUserInput } from "./inputs/create-user.input"
import { UserProfileModel } from "./models/profile.model"
import { UserModel } from "./models/user.model"

@Resolver("Account")
export class AccountResolver {
	public constructor(private readonly accountService: AccountService) {}

	@Authorization()
	@Query(() => UserModel, { name: "findMe" })
	public async me(@Authorized("id") id: string) {
		return this.accountService.me(id)
	}

	@Query(() => UserProfileModel, { name: "findProfile" })
	public async findProfile(@Args("username") username: string) {
		return this.accountService.findProfile(username)
	}

	@Mutation(() => Boolean, { name: "createUser" })
	public async create(@Args("data") input: CreateUserInput) {
		return this.accountService.create(input)
	}
}
