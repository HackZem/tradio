import { ConflictException, Injectable } from "@nestjs/common"
import { hash } from "argon2"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { VerificationService } from "../verification/verification.service"

import { CreateUserInput } from "./inputs/create-user.input"

@Injectable()
export class AccountService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly verificationService: VerificationService,
	) {}

	public async me(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id,
			},
		})

		return user
	}

	public async findProfile(username: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				username,
			},
			select: {
				username: true,
				description: true,
				avatar: true,
				phone: true,
				region: true,
				country: true,
			},
		})

		return user
	}

	public async create(input: CreateUserInput) {
		const { username, email, password } = input

		const isUsernameExists = await this.prismaService.user.findUnique({
			where: {
				username: username,
			},
		})

		if (isUsernameExists) {
			throw new ConflictException("This username is already taken")
		}

		const isEmailExists = await this.prismaService.user.findUnique({
			where: {
				email: email,
			},
		})

		if (isEmailExists) {
			throw new ConflictException("This email is already taken")
		}

		const user = await this.prismaService.user.create({
			data: { username, email, password: await hash(password) },
		})

		await this.verificationService.sendVerificationToken(user)

		return true
	}
}
