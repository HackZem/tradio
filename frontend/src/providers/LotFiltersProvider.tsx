"use client"

import { useSearchParams } from "next/navigation"
import { PropsWithChildren, useEffect } from "react"

import { useLotFiltersUrlSync } from "@/hooks/useLotFiltersUrlSync"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

export function LotFiltersProvider({ children }: PropsWithChildren<unknown>) {
	const searchParams = useSearchParams()

	useLotFiltersUrlSync()

	const initFromUrl = useLotFiltersStore(state => state.initFromUrl)

	//TODO: lags with filters -> when we click quickly on the checkboxes, the state can return from the url
	useEffect(() => {
		initFromUrl(searchParams)
	}, [searchParams, initFromUrl])

	return <>{children}</>
}
