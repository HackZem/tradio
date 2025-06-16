import { InternalServerErrorException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import type { User } from "@prisma/client"
import type { Request } from "express"

import type { SessionMetadata } from "../types/session-metadata.types"

export const saveSession = (
	req: Request,
	user: User,
	metadata: SessionMetadata,
) => {
	return new Promise((resolve, reject) => {
		req.session.createAt = new Date()
		req.session.userId = user.id
		req.session.metadata = metadata

		req.session.save(err => {
			if (err) {
				return reject(
					new InternalServerErrorException("Failed to save session"),
				)
			}

			resolve(user)
		})
	})
}

export const destroySession = (req: Request, configService: ConfigService) => {
	return new Promise((resolve, reject) => {
		req.session.destroy(err => {
			if (err) {
				return reject(
					new InternalServerErrorException("Failed to terminate the session"),
				)
			}

			req.res?.clearCookie(configService.getOrThrow<string>("SESSION_NAME"))
			resolve(true)
		})
	})
}
