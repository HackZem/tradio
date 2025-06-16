import { ConfigService } from "@nestjs/config"
import { createId } from "@paralleldrive/cuid2"
import { TokenType, type User } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import ms, { StringValue } from "./ms.util"

export const generateToken = async (
	prismaService: PrismaService,
	configService: ConfigService,
	user: User,
	type: TokenType,
	isCUID: boolean = false,
) => {
	let token: string

	if (isCUID) {
		token = createId()
	} else {
		token = Math.floor(Math.random() * (10 ** 6 - 10 ** 5) + 10 ** 5).toString()
	}

	const expiresIn = new Date(
		new Date().getTime() +
			ms(configService.getOrThrow<StringValue>("TOKEN_MAX_AGE")),
	)

	const existingToken = await prismaService.token.findFirst({
		where: {
			type,
			user: {
				id: user.id,
			},
		},
	})

	if (existingToken) {
		await prismaService.token.delete({
			where: {
				id: existingToken.id,
			},
		})
	}

	const newToken = await prismaService.token.create({
		data: {
			token,
			expiresIn,
			type,
			user: {
				connect: {
					id: user.id,
				},
			},
		},
		include: {
			user: true,
		},
	})

	return newToken
}
