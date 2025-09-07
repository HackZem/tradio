"use client"

import { useSearchParams } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"

import { useLotFiltersUrlSync } from "@/hooks/useLotFiltersUrlSync"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

export function LotFiltersProvider({ children }: PropsWithChildren<unknown>) {
	const searchParams = useSearchParams()

	const isSyncing = useLotFiltersUrlSync()

	const initFromUrl = useLotFiltersStore(state => state.initFromUrl)

	useEffect(() => {
		if (isSyncing) return

		initFromUrl(searchParams)
	}, [searchParams, initFromUrl])

	return <>{children}</>
}
