import { Args, Mutation, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"
import { FileUpload, GraphQLUpload } from "graphql-upload-ts"

import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe"

import { ChangeProfileInfoInput } from "./inputs/change-prifile-info.input"
import { ProfileService } from "./profile.service"

@Resolver("Profile")
export class ProfileResolver {
	public constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeProfileAvatar" })
	public async changeAvatar(
		@Authorized() user: User,
		@Args("avatar", { type: () => GraphQLUpload }, FileValidationPipe)
		avatar: FileUpload,
	) {
		return this.profileService.changeAvatar(user, avatar)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removeProfileAvatar" })
	public async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvater(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeProfileInfo" })
	public async changeInfo(
		@Authorized() user: User,
		@Args("data") input: ChangeProfileInfoInput,
	) {
		return this.profileService.changeInfo(user, input)
	}
}
