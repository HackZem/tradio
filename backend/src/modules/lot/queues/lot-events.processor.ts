import { Process, Processor } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import { Job } from "bull"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { NotificationService } from "../../notification/notification.service"

@Processor("lot-events")
export class LotEventsProcessor {
	private readonly logger = new Logger(LotEventsProcessor.name)

	public constructor(
		private readonly notificationService: NotificationService,
		private readonly prismaService: PrismaService,
	) {}

	@Process("lot-warning")
	public async handleLotWarning(job: Job) {
		const { lotId, minutesLeft } = job.data

		try {
			const lot = await this.prismaService.lot.findUnique({
				where: { id: lotId },
			})

			if (!lot) {
				this.logger.warn(`Lot ${lotId} is not found`)
				return
			}

			await this.notificationService.notifyLotEnding(lotId, minutesLeft)
		} catch (err) {
			this.logger.error(`Error processing warning for lot ${lotId}:`, err)
		}
	}

	@Process("lot-end")
	public async handleLotEnd(job: Job) {
		const { lotId } = job.data

		try {
			const lot = await this.prismaService.lot.findUnique({
				where: { id: lotId },
			})

			if (!lot) {
				this.logger.warn(`Lot ${lotId} is not found`)
				return
			}

			if (!lot.isActive) {
				this.logger.warn(`Lot ${lotId} is not active`)
				return
			}

			await this.prismaService.lot.update({
				where: { id: lotId },
				data: { isActive: false },
			})

			await this.notificationService.notifyLotEnded(lotId)
		} catch (err) {
			this.logger.error(`Error processing warning for lot ${lotId}:`, err)
		}
	}
}
