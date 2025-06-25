import { Module } from "@nestjs/common"

import { BidResolver } from "./bid.resolver"
import { BidService } from "./bid.service"

@Module({
	providers: [BidResolver, BidService],
})
export class BidModule {}
