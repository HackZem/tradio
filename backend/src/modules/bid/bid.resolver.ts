import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { User } from "@prisma/client"

import { Authorization } from "@/src/shared/decorators/auth.decorator"
import { Authorized } from "@/src/shared/decorators/authorized.decorator"

import { BidService } from "./bid.service"
import { PlaceBidInput } from "./inputs/place-bid.input"

@Resolver("Bid")
export class BidResolver {
	constructor(private readonly bidService: BidService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: "placeBid" })
	public async placeBid(
		@Authorized() user: User,
		@Args("data") input: PlaceBidInput,
	) {
		return this.bidService.place(user, input)
	}

	@Query(() => Boolean, { name: "findLastBid" })
	public async findLastBid(@Args("lotId") lotId: string) {
		return this.bidService.findLastBid(lotId)
	}
}
