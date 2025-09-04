"use client"

import { Icon } from "@iconify-icon/react"
import { Alpha2Code } from "i18n-iso-countries"
import { useTranslations } from "next-intl"

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/common/Card"
import { CountryCombobox } from "@/components/ui/elements/CountryCombobox"
import { Heading } from "@/components/ui/elements/Heading"
import { RegionCombobox } from "@/components/ui/elements/RegionCombobox"
import { FilterCheckbox } from "@/components/ui/elements/filters/FilterCheckbox"

import { ConditionType, LotType } from "@/graphql/generated/output"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

import { LotPriceFilter } from "./LotPriceFilter"

interface LotFiltersProps {
	maxPrice: number
}

export function LotFilters({ maxPrice }: LotFiltersProps) {
	const t = useTranslations("lot.list.filters")
	const tEnums = useTranslations("enums")

	const {
		lotTypes,
		addLotType,
		removeLotType,
		conditionTypes,
		addConditionType,
		removeConditionType,
		country,
		region,
		setCountry,
		setRegion,
	} = useLotFiltersStore()

	return (
		<Card className='w-full max-w-[300px] gap-y-0 py-4'>
			<CardHeader>
				<CardTitle className='text-xl'>{t("heading")}</CardTitle>
			</CardHeader>
			<CardContent className='space-y-5'>
				<div className='space-y-[7px]'>
					<Heading title={t("lotTypes")} size={"sm"} />
					{Object.entries(LotType).map(([_, key]) => (
						<FilterCheckbox
							title={tEnums(`lotTypes.${key}`)}
							isChecked={lotTypes.includes(key)}
							onCheckedChange={checked => {
								checked ? addLotType(key) : removeLotType(key)
							}}
							key={key}
						/>
					))}
				</div>
				<LotPriceFilter initMaxPrice={maxPrice} />
				<div className='space-y-[7px]'>
					<Heading title={t("condition")} size={"sm"} />
					{Object.entries(ConditionType).map(([_, key]) => (
						<FilterCheckbox
							title={tEnums(`conditionTypes.${key}`)}
							isChecked={conditionTypes.includes(key)}
							onCheckedChange={checked => {
								checked ? addConditionType(key) : removeConditionType(key)
							}}
							key={key}
						/>
					))}
				</div>
				<div className='space-y-[7px]'>
					<Heading title={t("location.heading")} size={"sm"} />
					<div className='flex w-full gap-x-2.5'>
						<CountryCombobox
							className='border-border text-foreground text-md h-[35px] flex-1
								hover:border-transparent'
							value={country}
							onValueChange={country => setCountry(country as Alpha2Code)}
						/>
						<Icon
							icon='lets-icons:close-round'
							width='28'
							className='hover:text-destructive cursor-pointer'
							onClick={() => setCountry(undefined!)}
						/>
					</div>
					<div className='flex w-full gap-x-2.5'>
						<RegionCombobox
							className='border-border text-foreground text-md h-[35px] flex-1
								hover:border-transparent'
							country={country}
							value={region}
							onValueChange={region => setRegion(region)}
						/>
						<Icon
							icon='lets-icons:close-round'
							width='28'
							className='hover:text-destructive cursor-pointer'
							onClick={() => setRegion(undefined!)}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
