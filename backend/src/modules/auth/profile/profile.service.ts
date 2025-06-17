import { ConflictException, Injectable } from "@nestjs/common"
import { User } from "@prisma/client"
import { FileUpload } from "graphql-upload-ts"
import * as sharp from "sharp"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { S3Service } from "../../libs/s3/s3.service"

import { ChangeProfileInfoInput } from "./inputs/change-prifile-info.input"

@Injectable()
export class ProfileService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly s3Service: S3Service,
	) {}

	public async changeAvatar(user: User, file: FileUpload) {
		if (user.avatar) {
			await this.s3Service.remove(user.avatar)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)

		const fileName = `/channels/${user.username}.webp`

		if (file.filename && file.filename.endsWith(".gif")) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.s3Service.upload(processedBuffer, fileName, "image/webp")
		} else {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(512, 512)
				.webp()
				.toBuffer()

			await this.s3Service.upload(processedBuffer, fileName, "image/webp")
		}

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				avatar: fileName,
			},
		})
	}

	public async removeAvater(user: User) {
		if (!user.avatar) return

		await this.s3Service.remove(user.avatar)

		await this.prismaService.user.update({
			where: { id: user.id },
			data: {
				avatar: null,
			},
		})

		return true
	}

	public async changeInfo(user: User, input: ChangeProfileInfoInput) {
		const { username, ...data } = input

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: { username },
		})

		if (isUsernameExists && username !== user.username) {
			throw new ConflictException("This username is already taken")
		}

		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: { ...data, username },
		})

		return true
	}
}
