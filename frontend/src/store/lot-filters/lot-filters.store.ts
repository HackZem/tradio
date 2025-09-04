import { Alpha2Code } from "i18n-iso-countries"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import {
	ConditionType,
	LotType,
	SortBy,
	SortOrder,
} from "@/graphql/generated/output"

import { ILotFiltersStore } from "./lot-filters.types"

export const useLotFiltersStore = create<ILotFiltersStore>()(
	subscribeWithSelector(set => ({
		sortBy: undefined,
		sortOrder: undefined,
		lotTypes: [],
		categories: [],
		country: undefined,
		region: undefined,
		query: "",
		conditionTypes: [],
		minPrice: undefined,
		maxPrice: undefined,

		initFromUrl: (searchParams: URLSearchParams) => {
			set({
				sortBy:
					SortBy[searchParams.get("sortBy") as keyof typeof SortBy] ??
					undefined,
				sortOrder:
					SortOrder[searchParams.get("sortOrder") as keyof typeof SortOrder] ??
					undefined,
				query: searchParams.get("query") ?? "",
				categories: searchParams.getAll("category"),
				country: (searchParams.get("country") as Alpha2Code) ?? undefined,
				region: searchParams.get("region") ?? undefined,
				conditionTypes: searchParams
					.getAll("condition")
					.map(
						conditionType =>
							ConditionType[conditionType as keyof typeof ConditionType],
					) as ConditionType[],
				lotTypes: searchParams
					.getAll("type")
					.map(
						conditionType => LotType[conditionType as keyof typeof LotType],
					) as LotType[],
				minPrice: Number.parseFloat(searchParams.get("min") ?? "") || undefined,
				maxPrice: Number.parseFloat(searchParams.get("max") ?? "") || undefined,
			})
		},

		setSortBy: sortBy => {
			set({ sortBy })
		},
		setSortOrder: sortOrder => {
			set({ sortOrder })
		},

		addLotType: (lotType: LotType) =>
			set(state => ({ lotTypes: [...state.lotTypes, lotType] })),
		removeLotType: (lotType: LotType) =>
			set(state => ({
				lotTypes: [...state.lotTypes.filter(v => v !== lotType)],
			})),

		setMinPrice: (amount?: number) => set({ minPrice: amount }),
		setMaxPrice: (amount?: number) => set({ maxPrice: amount }),

		addConditionType: (conditionType: ConditionType) =>
			set(state => ({
				conditionTypes: [...state.conditionTypes, conditionType],
			})),
		removeConditionType: (conditionType: ConditionType) =>
			set(state => ({
				conditionTypes: [
					...state.conditionTypes.filter(v => v !== conditionType),
				],
			})),

		setCountry: (country: Alpha2Code) => set({ country, region: undefined }),
		setRegion: (region: string) => set({ region }),

		setQuery: (query: string) => set({ query }),

		addCategory: (category: string) =>
			set(state => ({
				categories: [...state.categories, category],
			})),
		removeCategory: (category: string) =>
			set(state => ({
				categories: [...state.categories.filter(v => v !== category)],
			})),
	})),
)
