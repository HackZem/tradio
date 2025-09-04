"use client"

import { useTranslations } from "next-intl"
import { useEffect } from "react"

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/common/Card"
import { FilterSelect } from "@/components/ui/elements/filters/FilterSelect"

import { SortBy, SortOrder } from "@/graphql/generated/output"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

export function LotSort() {
	const t = useTranslations("lot.list.sort")
	const tEnums = useTranslations("enums")

	const { sortBy, sortOrder, setSortOrder, setSortBy } = useLotFiltersStore()

	return (
		<Card className='h-[150px] w-full gap-y-0 py-4'>
			<CardHeader>
				<CardTitle className='text-xl'>{t("heading")}</CardTitle>
			</CardHeader>
			<CardContent className='space-y-[7px]'>
				<FilterSelect
					title={t("by")}
					value={sortBy ?? "empty"}
					onValueChange={value =>
						setSortBy(value === "empty" ? undefined : (value as SortBy))
					}
					elements={Object.entries(SortBy).map(element => ({
						title: tEnums(`sortBy.${element[1]}`),
						slug: element[1],
					}))}
				/>
				<FilterSelect
					title={t("order")}
					value={sortOrder ?? "empty"}
					onValueChange={value =>
						setSortOrder(value === "empty" ? undefined : (value as SortOrder))
					}
					elements={Object.entries(SortOrder).map(element => ({
						title: tEnums(`sortOrder.${element[1]}`),
						slug: element[1],
					}))}
				/>
			</CardContent>
		</Card>
	)
}
