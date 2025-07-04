import { Injectable } from "@nestjs/common"
import { Cron, CronExpression } from "@nestjs/schedule"

import { PrismaService } from "@/src/core/prisma/prisma.service"

@Injectable()
export class CronService {
	public constructor(private readonly prismaService: PrismaService) {}

	@Cron(CronExpression.EVERY_DAY_AT_1AM)
	public async deleteOldNotifications() {
		const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14)

		await this.prismaService.notification.deleteMany({
			where: {
				createdAt: {
					lte: sevenDaysAgo,
				},
			},
		})
	}
}
