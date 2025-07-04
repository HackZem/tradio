import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { User } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { NotificationService } from "../notification/notification.service"

import { PlaceBidInput } from "./inputs/place-bid.input"

@Injectable()
export class BidService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly notificationService: NotificationService,
	) {}

	public async place(user: User, input: PlaceBidInput) {
		const { amount, lotId } = input

		const lot = await this.prismaService.lot.findUnique({
			where: { id: lotId },
			include: {
				bids: {
					orderBy: {
						amount: "desc",
					},
				},
			},
		})

		if (!lot) {
			throw new NotFoundException("Lot not found")
		}

		if (!lot.isActive) {
			throw new BadRequestException("Lot is not active")
		}

		if (lot.userId === user.id) {
			throw new ConflictException("User can not place a bid on his lot")
		}

		const maxAmount = lot.currentPrice

		if (maxAmount && +amount <= +maxAmount) {
			throw new BadRequestException(
				"The bid must be higher than the last amount",
			)
		}

		await this.prismaService.bid.create({
			data: {
				amount,
				user: {
					connect: {
						id: user.id,
					},
				},
				lot: {
					connect: {
						id: lotId,
					},
				},
			},
		})

		await this.prismaService.lot.update({
			where: {
				id: lotId,
			},
			data: {
				subscriptions: {
					create: {
						user: {
							connect: {
								id: user.id,
							},
						},
					},
				},
				currentPrice: amount,
			},
		})

		await this.notificationService.notifyNewBid(lotId, user.id, amount)

		return true
	}

	public async findLastBid(lotId: string) {
		const bid = this.prismaService.bid.findFirst({
			where: { lotId },
			orderBy: {
				amount: "desc",
			},
			take: 1,
		})

		if (!bid) {
			throw new NotFoundException("The bid not found")
		}

		return bid
	}
}
