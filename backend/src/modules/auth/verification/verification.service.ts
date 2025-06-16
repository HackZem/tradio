import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { TokenType, type User } from "@prisma/client"
import type { Request } from "express"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { generateToken } from "@/src/shared/utils/generate-token.util"
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util"
import { saveSession } from "@/src/shared/utils/session.util"

import { MailService } from "../../libs/mail/mail.service"

import { VerificationInput } from "./inputs/verification.input"

@Injectable()
export class VerificationService {
	public constructor(
		private readonly mailService: MailService,
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string,
	) {
		const { token } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: { token, type: TokenType.EMAIL_VERIFY },
		})

		if (!existingToken) {
			throw new NotFoundException("Token is not found ")
		}

		const isExpired = new Date(existingToken.expiresIn) < new Date()

		if (isExpired) {
			throw new BadRequestException("Token is expired")
		}

		if (!existingToken.userId) {
			throw new BadRequestException("Token does not have a valid id")
		}

		const user = await this.prismaService.user.update({
			where: { id: existingToken.userId },
			data: {
				isEmailVerified: true,
			},
		})

		await this.prismaService.token.delete({
			where: { id: existingToken.id, type: existingToken.type },
		})

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			this.configService,
			user,
			TokenType.EMAIL_VERIFY,
			true,
		)

		await this.mailService.sendVerificationToken(
			user.email,
			user.username,
			verificationToken.token,
		)

		return true
	}
}
