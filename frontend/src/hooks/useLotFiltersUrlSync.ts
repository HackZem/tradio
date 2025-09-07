import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
	ConditionType,
	LotType,
	SortBy,
	SortOrder,
} from "@/graphql/generated/output"

import { ROUTES } from "@/libs/constants/routes.constants"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

import { getEnumKey } from "@/utils/get-enum-key"

export const useLotFiltersUrlSync = () => {
	const store = useLotFiltersStore

	const pathname = usePathname()
	const router = useRouter()

	const [isSyncing, setIsSyncing] = useState<boolean>(false)

	useEffect(() => {
		let debounceTimer: NodeJS.Timeout

		const unsubscribe = store.subscribe(
			state => state,
			state => {
				clearTimeout(debounceTimer)

				setIsSyncing(true)
				debounceTimer = setTimeout(() => {
					const params = new URLSearchParams()

					state.categories.forEach(category => {
						params.append("category", category)
					})

					state.lotTypes.forEach(lotType => {
						params.append("type", getEnumKey(LotType, lotType) ?? "")
					})

					state.conditionTypes.forEach(conditionType => {
						params.append(
							"condition",
							getEnumKey(ConditionType, conditionType) ?? "",
						)
					})

					if (state.query) {
						params.set("query", state.query)
					}

					if (state.minPrice) {
						params.set("min", state.minPrice.toString())
					}
					if (state.maxPrice) {
						params.set("max", state.maxPrice.toString())
					}

					if (state.country) {
						params.set("country", state.country)
					}
					if (state.region) {
						params.set("region", state.region)
					}

					if (state.sortBy) {
						params.set("sortBy", getEnumKey(SortBy, state.sortBy) ?? "")
					}

					if (state.sortOrder) {
						params.set(
							"sortOrder",
							getEnumKey(SortOrder, state.sortOrder) ?? "",
						)
					}

					const newParams = params.toString()

					if (!newParams.length && pathname !== ROUTES.LOTS) {
						setIsSyncing(false)
						return
					}

					console.log(newParams)

					const url = ROUTES.LOTS + "?" + newParams
					router.replace(url)

					setIsSyncing(false)
				}, 500)
			},
		)

		return () => {
			unsubscribe()
			clearTimeout(debounceTimer)
		}
	}, [router, store, pathname])

	return isSyncing
}
