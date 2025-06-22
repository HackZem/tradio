import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { createId } from "@paralleldrive/cuid2"
import type { Prisma, User } from "@prisma/client"
import { FileUpload } from "graphql-upload-ts"
import * as sharp from "sharp"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { S3Service } from "../libs/s3/s3.service"

import { ChangeLotInfoInput } from "./inputs/change-lot-info.input"
import { FiltersInput } from "./inputs/filters.input"
import { RemovePhotoInput } from "./inputs/remove-photo.input"
import { ReorderPhotosInput } from "./inputs/reorder-photos.input"
import { UploadPhotoInput } from "./inputs/upload-photo.input"

@Injectable()
export class LotService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly s3Service: S3Service,
	) {}

	private findByQuery(query: string): Prisma.LotWhereInput {
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

	public async findAll(input: FiltersInput) {
		const { query, skip, take } = input

		const whereClause = query ? this.findByQuery(query) : undefined

		const lots = this.prismaService.lot.findMany({
			where: whereClause,
			include: { user: {} },
			skip: skip ?? 0,
			take: take ?? 16,
		})

		return lots
	}

	public async findById(id: string) {
		const lot = await this.prismaService.lot.findUnique({ where: { id } })

		if (!lot) {
			throw new NotFoundException("Lot not found")
		}

		return lot
	}

	public async changeInfo(user: User, input: ChangeLotInfoInput) {
		const {
			city,
			condition,
			country,
			description,
			returnPeriod,
			title,
			lotId,
		} = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
		})

		if (!lot) {
			throw new NotFoundException("Lot not found")
		}

		if (lot.userId !== user.id) {
			throw new ForbiddenException(
				"You do not have permission to edit this lot",
			)
		}
		//TODO: продовжую роботу тут, треба добавити обмеження коли будуть ставки
		await this.prismaService.lot.update({
			where: { id: lotId },
			data: {
				city,
				condition,
				country,
				description: description ?? undefined,
				returnPeriod,
				title,
			},
		})
	}

	public async uploadPhoto(
		input: UploadPhotoInput,
		user: User,
		file: FileUpload,
	) {
		const { lotId } = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
		})

		if (!lot) {
			throw new NotFoundException("Lot not found")
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

		const fileName = `/lots/${user.username}/${createId()}.webp`

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
	}

	public async removePhoto(user: User, input: RemovePhotoInput) {
		const { lotId, photoKey } = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
		})

		if (!lot) {
			throw new NotFoundException("Lot not found")
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
			throw new NotFoundException("Lot not found")
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
