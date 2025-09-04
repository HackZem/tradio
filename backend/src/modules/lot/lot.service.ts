import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { createId } from "@paralleldrive/cuid2"
import { Prisma, User } from "@prisma/client"
import { FileUpload } from "graphql-upload-ts"
import * as sharp from "sharp"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { S3Service } from "../libs/s3/s3.service"

import { ChangeLotInfoInput } from "./inputs/change-lot-info.input"
import { CreateLotInput } from "./inputs/create-lot.input"
import {
	FiltersInput,
	PriceRangeInput,
	SortBy,
	SortOrder,
} from "./inputs/filters.input"
import { RemovePhotoInput } from "./inputs/remove-photo.input"
import { ReorderPhotosInput } from "./inputs/reorder-photos.input"
import { UploadPhotoInput } from "./inputs/upload-photo.input"
import { LotQueueService } from "./queues/lot-queue.service"

@Injectable()
export class LotService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly s3Service: S3Service,
		private readonly lotQueueService: LotQueueService,
	) {}

	private buildQueryCondition(query: string): Prisma.LotWhereInput {
		if (query[0] === "@") {
			return {
				OR: [
					{
						user: {
							username: {
								contains: query.slice(1).trim(),
								mode: "insensitive",
							},
						},
					},
				],
			}
		}

		return {
			OR: [
				{
					title: {
						contains: query,
						mode: "insensitive",
					},
				},
				{
					user: {
						username: {
							contains: query,
							mode: "insensitive",
						},
					},
				},
			],
		}
	}

	private buildPriceRangeCondition({
		min,
		max,
	}: PriceRangeInput): Prisma.LotWhereInput {
		return {
			currentPrice: {
				gte: min,
				lte: max,
			},
		}
	}

	private buildOrderBy(
		sortBy?: SortBy,
		sortOrder?: SortOrder,
	): Prisma.Enumerable<Prisma.LotOrderByWithRelationInput> {
		const order = sortOrder || SortOrder.DESC

		if (sortBy === SortBy.BIDS) {
			return sortBy ? [{ [sortBy]: { _count: order } }, { id: "asc" }] : {}
		}

		return sortBy ? { [sortBy]: order } : {}
	}

	private buildWhereClause({
		query,
		priceRange,
		country,
		region,
		lotTypes,
		conditionTypes,
		categorySlugs,
	}: FiltersInput): Prisma.LotWhereInput {
		const conditions: Prisma.LotWhereInput[] = []

		const queryTrim = query?.trim()
		if (queryTrim) {
			conditions.push(this.buildQueryCondition(queryTrim))
		}
		if (priceRange?.min || priceRange?.max) {
			conditions.push(this.buildPriceRangeCondition(priceRange))
		}
		if (country || region) {
			conditions.push({
				country,
				region,
			})
		}
		if ((lotTypes ?? []).length > 0) {
			conditions.push({ type: { in: lotTypes } })
		}
		if ((conditionTypes ?? []).length > 0) {
			conditions.push({ condition: { in: conditionTypes } })
		}
		if ((categorySlugs ?? []).length > 0) {
			conditions.push({ categorySlug: { in: categorySlugs } })
		}

		return { AND: conditions }
	}

	public async findAll(input: FiltersInput) {
		const { skip, take, sortBy, sortOrder } = input

		const whereClause = this.buildWhereClause(input)

		const orderBy = this.buildOrderBy(sortBy, sortOrder)

		const lots = this.prismaService.lot.findMany({
			where: whereClause,
			include: {
				user: true,
				category: true,
				_count: {
					select: {
						bids: true,
					},
				},
			},
			skip: skip ?? 0,
			take: take ?? 16,
			orderBy,
		})

		const maxPrice = await this.prismaService.lot.aggregate({
			_max: { currentPrice: true },
		})

		return { lots, maxPrice: maxPrice._max.currentPrice }
	}

	public async findById(id: string) {
		const lot = await this.prismaService.lot.findUnique({
			where: { id },
			include: { user: true, category: true },
		})

		if (!lot) {
			throw new NotFoundException("Lot is not found")
		}

		return lot
	}

	public async create(user: User, input: CreateLotInput) {
		const { categorySlug, firstPrice, ...data } = input

		const newLot = await this.prismaService.lot.create({
			data: {
				...data,
				firstPrice,
				currentPrice: firstPrice,
				category: { connect: { slug: categorySlug } },
				user: {
					connect: {
						id: user.id,
					},
				},
			},
		})

		if (newLot.type !== "BUYNOW")
			await this.lotQueueService.scheduleLotEvents(newLot)

		return true
	}

	public async changeInfo(user: User, input: ChangeLotInfoInput) {
		const {
			region,
			condition,
			country,
			description,
			returnPeriod,
			title,
			lotId,
			categorySlug,
			expiresAt,
			firstPrice,
		} = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
			include: { bids: true },
		})

		if (!lot) {
			throw new NotFoundException("Lot is not found")
		}

		if (lot.userId !== user.id) {
			throw new ForbiddenException(
				"You do not have permission to edit this lot",
			)
		}

		const isBidPlaced = lot.bids.length > 0

		const data: Prisma.LotUpdateInput = isBidPlaced
			? {
					title: lot.title.startsWith(title ?? "") ? title : lot.title,
				}
			: {
					region,
					condition,
					country,
					description,
					returnPeriod,
					title,
					expiresAt,
					firstPrice,
					category: {
						connect: {
							slug: categorySlug ?? lot.categorySlug!,
						},
					},
				}

		await this.prismaService.lot.update({
			where: { id: lotId },
			data,
		})

		return true
	}

	public async subscribe(user: User, lotId: string) {
		const result = await this.prismaService.$transaction(async tx => {
			const lot = await tx.lot.findUnique({
				where: {
					id: lotId,
				},
				include: { subscriptions: { where: { userId: user.id } } },
			})

			if (!lot) {
				throw new NotFoundException("Lot is not found")
			}

			if (lot.userId === user.id) {
				throw new ConflictException("User cant subscribe to his lot")
			}

			if (lot.subscriptions.length > 0) {
				throw new ConflictException("User already has a subscription")
			}

			await tx.lot.update({
				where: { id: lotId },
				data: {
					subscriptions: {
						create: {
							user: { connect: { id: user.id } },
						},
					},
				},
			})

			return true
		})

		return result
	}

	public async unsubscribe(user: User, lotId: string) {
		const result = await this.prismaService.$transaction(async tx => {
			const lot = await tx.lot.findUnique({
				where: {
					id: lotId,
				},
				include: { subscriptions: { where: { userId: user.id } } },
			})

			if (!lot) {
				throw new NotFoundException("Lot is not found")
			}

			if (!lot.subscriptions.length) {
				throw new BadRequestException("User is not subscribed")
			}

			await tx.lot.update({
				where: { id: lotId },
				data: {
					subscriptions: {
						delete: {
							lotId_userId: {
								userId: user.id,
								lotId,
							},
						},
					},
				},
			})

			return true
		})

		return result
	}

	public async uploadPhoto(
		user: User,
		input: UploadPhotoInput,
		file: FileUpload,
	) {
		const { lotId } = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
		})

		if (!lot) {
			throw new NotFoundException("Lot is not found")
		}

		if (lot.userId !== user.id) {
			throw new ForbiddenException(
				"You do not have permission to edit this lot",
			)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `lots/${lot.id}/${createId()}.webp`

		const processedBuffer = await sharp(buffer)
			.resize(1280, 1280)
			.webp()
			.toBuffer()

		await this.s3Service.upload(processedBuffer, fileName, "image/webp")

		await this.prismaService.lot.update({
			where: { id: lotId },
			data: {
				photos: {
					push: fileName,
				},
			},
		})

		return true
	}

	public async removePhoto(user: User, input: RemovePhotoInput) {
		const { lotId, photoKey } = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
		})

		if (!lot) {
			throw new NotFoundException("Lot is not found")
		}

		if (lot.userId !== user.id) {
			throw new ForbiddenException(
				"You do not have permission to edit this lot",
			)
		}

		await this.s3Service.remove(photoKey)

		await this.prismaService.lot.update({
			where: { id: lotId },
			data: {
				photos: {
					set: lot.photos.filter(key => key !== photoKey),
				},
			},
		})

		return true
	}

	public async reorderPhotos(user: User, input: ReorderPhotosInput) {
		const { lotId, photoKeys } = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
		})

		if (!lot) {
			throw new NotFoundException("Lot is not found")
		}

		if (lot.userId !== user.id) {
			throw new ForbiddenException(
				"You do not have permission to edit this lot",
			)
		}

		const isPhotosExists =
			photoKeys.filter(key => !lot.photos.includes(key)).length <= 0

		if (!isPhotosExists) {
			throw new BadRequestException("Some photos do not belong to this lot")
		}

		await this.prismaService.lot.update({
			where: { id: lotId },
			data: {
				photos: {
					set: photoKeys,
				},
			},
		})

		return true
	}
}
