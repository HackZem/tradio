import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { User } from "@prisma/client"

import { PrismaService } from "@/src/core/prisma/prisma.service"

import { PlaceBidInput } from "./inputs/place-bid.input"

@Injectable()
export class BidService {
	public constructor(private readonly prismaService: PrismaService) {}

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

		const maxAmount = lot.bids[0]?.amount

		if (maxAmount && +amount <= +maxAmount) {
			throw new BadRequestException("The bid must be higher than the last bid")
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

		return true
	}

	public async findLastBid(lotId: string) {
		const bid = this.prismaService.bid.findFirst({
			where: { lotId },
			orderBy: {
				amount: "desc",
			},
		})

		if (!bid) {
			throw new NotFoundException("The Bid not found")
		}

		return bid
	}
}
