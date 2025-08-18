import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from "@nestjs/graphql"
import { User } from "@prisma/client"
import { FileUpload, GraphQLUpload } from "graphql-upload-ts"

import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"
import { FileValidationPipe } from "@/src/shared/pipes/file-validation.pipe"

import { PhotosArgs } from "./args/photos.args"
import { ChangeLotInfoInput } from "./inputs/change-lot-info.input"
import { CreateLotInput } from "./inputs/create-lot.input"
import { FiltersInput } from "./inputs/filters.input"
import { RemovePhotoInput } from "./inputs/remove-photo.input"
import { ReorderPhotosInput } from "./inputs/reorder-photos.input"
import { UploadPhotoInput } from "./inputs/upload-photo.input"
import { LotService } from "./lot.service"
import { LotModel } from "./models/lot.model"

@Resolver(() => LotModel)
export class LotResolver {
	constructor(private readonly lotService: LotService) {}

	@Query(() => [LotModel], { name: "findAllLots" })
	public async findAll(@Args("filters") input: FiltersInput) {
		return this.lotService.findAll(input)
	}

	@ResolveField(() => [String], { nullable: true })
	photos(@Parent() lot: LotModel, @Args() args: PhotosArgs) {
		if (args.limit) return lot.photos.slice(0, args.limit)
		return lot.photos
	}

	@Query(() => LotModel, { name: "findLotById" })
	public async findById(@Args("id") id: string) {
		return this.lotService.findById(id)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "changeLotInfo" })
	public async changeInfo(
		@Authorized() user: User,
		@Args("data") input: ChangeLotInfoInput,
	) {
		return this.lotService.changeInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "createLot" })
	public async create(
		@Authorized() user: User,
		@Args("data") input: CreateLotInput,
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

	@Authorization()
	@Mutation(() => Boolean, { name: "uploadPhotoToLot" })
	public async uploadPhoto(
		@Authorized() user: User,
		@Args("data") input: UploadPhotoInput,
		@Args("file", { type: () => GraphQLUpload }, FileValidationPipe)
		file: FileUpload,
	) {
		return this.lotService.uploadPhoto(user, input, file)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "removePhotoFromLot" })
	public async removePhoto(
		@Authorized() user: User,
		@Args("data") input: RemovePhotoInput,
	) {
		return this.lotService.removePhoto(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: "reorderPhotosInLot" })
	public async reorderPhotos(
		@Authorized() user: User,
		@Args("data") input: ReorderPhotosInput,
	) {
		return this.lotService.reorderPhotos(user, input)
	}
}
