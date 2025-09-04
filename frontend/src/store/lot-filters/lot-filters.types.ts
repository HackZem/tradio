import { Alpha2Code } from "i18n-iso-countries"

import {
	ConditionType,
	LotType,
	SortBy,
	SortOrder,
} from "@/graphql/generated/output"

export interface ILotFiltersStore {
	sortBy: SortBy | undefined
	sortOrder: SortOrder | undefined

	lotTypes: LotType[]

	minPrice: number | undefined
	maxPrice: number | undefined

	conditionTypes: ConditionType[]

	country: Alpha2Code | undefined
	region: string | undefined

	query: string

	categories: string[]

	setSortBy: (sortBy: SortBy) => void
	setSortOrder: (sortOrder: SortOrder) => void

	addLotType: (lotType: LotType) => void
	removeLotType: (lotType: LotType) => void

	setMinPrice: (amount?: number) => void
	setMaxPrice: (amount?: number) => void

	addConditionType: (conditionType: ConditionType) => void
	removeConditionType: (conditionType: ConditionType) => void

	setCountry: (country: Alpha2Code) => void
	setRegion: (region: string) => void

	setQuery: (query: string) => void

	addCategory: (category: string) => void
	removeCategory: (category: string) => void

	initFromUrl: (searchParams: URLSearchParams) => void
}
