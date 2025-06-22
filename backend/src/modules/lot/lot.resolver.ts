import { Args, Query, Resolver } from "@nestjs/graphql"

import { FiltersInput } from "./inputs/filters.input"
import { LotService } from "./lot.service"
import { LotModel } from "./models/lot.model"

@Resolver("Lot")
export class LotResolver {
	constructor(private readonly lotService: LotService) {}

	@Query(() => [LotModel], { name: "findAllLots" })
	public async findAll(@Args("filters") input: FiltersInput) {
		return this.lotService.findAll(input)
	}

	@Query(() => LotModel, { name: "findLotById" })
	public async findById(@Args("id") id: string) {
		return this.lotService.findById(id)
	}
}
