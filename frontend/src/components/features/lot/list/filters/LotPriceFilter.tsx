"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
} from "@/components/ui/common/Form"
import { Slider } from "@/components/ui/common/Slider"
import { Heading } from "@/components/ui/elements/Heading"
import { FilterAmountInput } from "@/components/ui/elements/filters/FilterAmountInput"

import useDebouncedCallback from "@/hooks/useDebouncedCallback"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

import lotPriceSchema, {
	TLotPriceSchema,
} from "@/schemas/lot/filters/lot-price.schema"

interface LotPriceFilterProps {
	initMaxPrice: number
}

export function LotPriceFilter({ initMaxPrice }: LotPriceFilterProps) {
	const t = useTranslations("lot.list.filters.price")
	const { minPrice, maxPrice, setMinPrice, setMaxPrice } = useLotFiltersStore()

	const form = useForm<TLotPriceSchema>({
		resolver: zodResolver(lotPriceSchema(initMaxPrice)),
		defaultValues: {
			min: minPrice,
			max: maxPrice,
		},
	})

	const { watch, setValue } = form

	const {
		errors: { min: minErrors, max: maxErrors },
	} = form.formState

	const [minValue, maxValue] = watch(["min", "max"])

	useEffect(() => {
		minPrice && setValue("min", minPrice)
	}, [minPrice, setValue])

	useEffect(() => {
		maxPrice && setValue("max", maxPrice)
	}, [maxPrice, setValue])

	const minDebounced = useDebouncedCallback((value?: number) => {
		!minErrors?.message?.length && setMinPrice(value || undefined)
	}, 300)

	const maxDebounced = useDebouncedCallback((value?: number) => {
		!maxErrors?.message?.length &&
			setMaxPrice(value === initMaxPrice ? undefined : value)
	}, 300)

	async function handleMinChange(value?: number) {
		setValue("min", value, { shouldValidate: true })

		const isValid = await form.trigger("min")
		if (isValid) {
			minDebounced(value)
		}
	}

	async function handleMaxChange(value?: number) {
		setValue("max", value, { shouldValidate: true })

		const isValid = await form.trigger("max")
		if (isValid) {
			maxDebounced(value)
		}
	}

	const minNum = minValue ?? 0
	const maxNum = maxValue ?? initMaxPrice

	return (
		<div className='space-y-[7px]'>
			<Heading title={t("heading")} size={"sm"} />
			<Form {...form}>
				<form className='space-y-[15px]'>
					<div className='flex items-center gap-x-2.5'>
						<span>{t("from")}</span>
						<FormField
							control={form.control}
							name='min'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<FilterAmountInput
											value={field.value?.toString() ?? ""}
											onChange={e => {
												const newPrice = +e.target.value
												if (isNaN(newPrice)) return

												handleMinChange(newPrice)
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<span>{t("to")}</span>
						<FormField
							control={form.control}
							name='max'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<FilterAmountInput
											value={field.value?.toString() ?? ""}
											onChange={e => {
												const newPrice = +e.target.value
												if (isNaN(newPrice)) return

												handleMaxChange(newPrice)
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className='space-y-[2px]'>
						<Slider
							defaultValue={[0, initMaxPrice]}
							min={0}
							max={initMaxPrice}
							value={[minNum, maxNum]}
							onValueChange={v => {
								handleMinChange(v[0])
								handleMaxChange(v[1])
							}}
						/>
						<div className='flex justify-between'>
							<span>{minNum}€</span>
							<span>{maxNum}€</span>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}
