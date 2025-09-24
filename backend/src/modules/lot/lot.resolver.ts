import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from "@nestjs/graphql"
import { User } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"
import { FilesValidationPipe } from "@/src/shared/pipes/files-validation.pipe"

import { PhotosArgs } from "./args/photos.args"
import { CreateLotInput } from "./inputs/create-lot.input"
import { FiltersInput } from "./inputs/filters.input"
import { UpdateLotInput } from "./inputs/update-lot.input"
import { LotService } from "./lot.service"
import { FindLotsModel } from "./models/find-lots.model"
import { LotPhotoModel } from "./models/lot-photo.model"
import { LotModel } from "./models/lot.model"

@Resolver(() => LotModel)
export class LotResolver {
	constructor(
		private readonly lotService: LotService,
		private readonly prismaService: PrismaService,
	) {}

	@Query(() => FindLotsModel, { name: "findAllLots" })
	public async findAll(@Args("filters") input: FiltersInput) {
		return this.lotService.findAll(input)
	}

	@ResolveField(() => [LotPhotoModel], { nullable: true })
	public photos(@Parent() lot: LotModel, @Args() args: PhotosArgs) {
		if (args.limit) return lot?.photos?.slice(0, args.limit) ?? []
		return lot.photos
	}

	@Authorization({ isAnonymous: true })
	@ResolveField(() => Boolean)
	public async isSubscribed(
		@Parent() lot: LotModel,
		@Authorized("id") userId: string,
	) {
		if (!userId) return false

		const subscription = await this.prismaService.lotSubscription.findUnique({
			where: {
				lotId_userId: {
					userId: userId,
					lotId: lot.id,
				},
			},
		})

		return !!subscription
	}

	@Query(() => LotModel, { name: "findLotById" })
	public async findById(@Args("id") id: string) {
		return this.lotService.findById(id)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "updateLot" })
	public async update(
		@Authorized() user: User,
		@Args(
			"data",
			{ type: () => UpdateLotInput },
			new FilesValidationPipe("photos"),
		)
		input: UpdateLotInput,
	) {
		return this.lotService.update(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "createLot" })
	public async create(
		@Authorized() user: User,
		@Args(
			"data",
			{ type: () => CreateLotInput },
			new FilesValidationPipe("photos"),
		)
		input: CreateLotInput,
	) {
		return this.lotService.create(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "subscribeToLot" })
	public async subscribe(
		@Authorized() user: User,
		@Args("lotId") lotId: string,
	) {
		return this.lotService.subscribe(user, lotId)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "unsubscribeFromLot" })
	public async unsubscribe(
		@Authorized() user: User,
		@Args("lotId") lotId: string,
	) {
		return this.lotService.unsubscribe(user, lotId)
	}
}
