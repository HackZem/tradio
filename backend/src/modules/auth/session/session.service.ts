import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { verify } from "argon2"
import type { Request } from "express"
import { SessionData } from "express-session"

import { PrismaService } from "@/src/core/prisma/prisma.service"
import { RedisService } from "@/src/core/redis/redis.service"
import { getSessionMetadata } from "@/src/shared/utils/session-metadata.util"
import { destroySession, saveSession } from "@/src/shared/utils/session.util"

import { VerificationService } from "../verification/verification.service"

import { LoginInput } from "./inputs/login.input"

@Injectable()
export class SessionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly verificationService: VerificationService,
	) {}

	public async findOtherByUser(req: Request) {
		const userId = req.session.userId

		if (!userId) {
			throw new NotFoundException("User is not found")
		}

		const keys = await this.redisService.keys("*")

		const userSessions: (SessionData & { id: string })[] = []

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (sessionData) {
				const session: SessionData = JSON.parse(sessionData)

				if (session.userId === userId) {
					userSessions.push({
						...session,
						id: key.split(":")[1],
					})
				}
			}
		}

		userSessions.sort(
			(a, b) =>
				new Date(b.createAt ?? 0).getTime() -
				new Date(a.createAt ?? 0).getTime(),
		)

		return userSessions.filter(session => session.id !== req.session.id)
	}

	public async findCurrent(req: Request) {
		const sessionId = req.session.id

		const sessionData = await this.redisService.get(
			`${this.configService.getOrThrow<string>("SESSION_FOLDER")}${sessionId}`,
		)

		const session = JSON.parse(sessionData!)

		return { ...session, id: sessionId }
	}

	public async clearCookie(req: Request) {
		req.res?.clearCookie(this.configService.getOrThrow<string>("SESSION_NAME"))

		return true
	}

	public async remove(req: Request, id: string) {
		if (req.session.id === id) {
			throw new ConflictException("The current session cannot be deleted")
		}

		await this.redisService.del(
			`${this.configService.getOrThrow<string>("SESSION_FOLDER")}${id}`,
		)

		return true
	}

	public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password } = input

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [{ username: { equals: login } }, { email: { equals: login } }],
			},
		})

		if (!user) {
			throw new NotFoundException("User is not found")
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new UnauthorizedException("Password is wrong")
		}

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)

			throw new BadRequestException(
				"Account not verified. Please, check your email to confirm your account",
			)
		}

		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	public async logout(req: Request) {
		return destroySession(req, this.configService)
	}
}
