import { InjectQueue } from "@nestjs/bull"
import { Injectable } from "@nestjs/common"
import type { Lot } from "@prisma/client"
import { Queue } from "bull"

import ms from "@/src/shared/utils/ms.util"

@Injectable()
export class LotQueueService {
	public constructor(
		@InjectQueue("lot-events") private readonly lotQueue: Queue,
	) {}

	public async scheduleLotEvents(lot: Lot) {
		const now = new Date().getTime()
		const endTime = new Date(lot.expiresAt!).getTime()

		const minutesBeforeEnd = 5

		const warningTime = endTime - ms(`${minutesBeforeEnd}m`)

		if (warningTime > now) {
			await this.lotQueue.add(
				"lot-warning",
				{
					lotId: lot.id,
					minutesLeft: minutesBeforeEnd,
				},
				{
					delay: warningTime - now,
					jobId: `warning-${lot.id}`,
				},
			)
		}

		if (endTime > now) {
			await this.lotQueue.add(
				"lot-end",
				{
					lotId: lot.id,
				},
				{
					delay: endTime - now,
					jobId: `end-${lot.id}`,
				},
			)
		}
	}

	public getClients() {
		return this.lotQueue.clients
	}
}
