"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify-icon/react"
import { Alpha2Code } from "i18n-iso-countries"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/common/Select"
import { CountryCombobox } from "@/components/ui/elements/CountryCombobox"
import { DayPicker } from "@/components/ui/elements/DayPicker"
import { FullTextTooltip } from "@/components/ui/elements/FullTextTooltip"
import { Heading } from "@/components/ui/elements/Heading"
import { RegionCombobox } from "@/components/ui/elements/RegionCombobox"
import { FilterAmountInput } from "@/components/ui/elements/filters/FilterAmountInput"

import {
	ConditionType,
	LotType,
	ReturnType,
	useFindAllCategoriesQuery,
} from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { cn } from "@/utils/tw-merge"

import { LotDescriptionEditor } from "./LotDescriptionEditor"
import { LotPhotosEditor } from "./LotPhotosEditor"
import lotSchema, { TLotSchema } from "@/schemas/lot/lot.schema"

export function LotForm() {
	const t = useTranslations("lot.form")
	const tEnums = useTranslations("enums")

	const { data } = useFindAllCategoriesQuery()

	const { user } = useCurrent()

	const form = useForm<TLotSchema>({
		resolver: zodResolver(lotSchema),
		defaultValues: {
			title: "",
		},
	})

	const { control, watch, setValue } = form

	const country = watch("country")
	const type = watch("type")

	return (
		<Form {...form}>
			<form className='flex gap-x-5'>
				<FormField
					control={control}
					name='photos'
					render={({ field }) => (
						<LotPhotosEditor photos={field.value} onChange={field.onChange} />
					)}
				/>
				<div className='w-full max-w-[420px] space-y-5'>
					<FormField
						control={control}
						name='title'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xl'>{t("titleLabel")}</FormLabel>
								<FormControl>
									<Input {...field} className='rounded-[12px]' />
								</FormControl>
							</FormItem>
						)}
					/>
					<div className='flex w-full gap-x-5'>
						<FormField
							control={control}
							name='type'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-xl'>{t("typeLabel")}</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={value => field.onChange(value)}
										>
											<SelectTrigger className='!h-[45px] w-full'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(LotType).map(element => (
													<SelectItem value={element[1]} key={element[1]}>
														{tEnums(`lotTypes.${element[1]}`)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='condition'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormLabel className='text-xl'>
										{t("conditionLabel")}
									</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={value => field.onChange(value)}
										>
											<SelectTrigger className='!h-[45px] w-full'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{Object.entries(ConditionType).map(element => (
													<SelectItem value={element[1]} key={element[1]}>
														{tEnums(`conditionTypes.${element[1]}`)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<div className='flex gap-x-5'>
						<FormField
							control={control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-xl'>
										{t(
											type === LotType.Auction
												? "firstPriceLabel"
												: "priceLabel",
										)}
									</FormLabel>
									<FormControl>
										<FilterAmountInput
											{...field}
											value={field.value ?? ""}
											className='h-[45px] w-full rounded-[12px]'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='buyNowPrice'
							render={({ field }) => (
								<FormItem className={cn(type !== LotType.Mixed && "invisible")}>
									<FormLabel className='text-xl'>
										{t("buyNowPriceLabel")}
									</FormLabel>
									<FormControl>
										<FilterAmountInput
											{...field}
											value={field.value ?? ""}
											className='h-[45px] w-full rounded-[12px]'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={control}
						name='categorySlug'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel className='text-xl'>{t("categoryLabel")}</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={value => field.onChange(value)}
									>
										<SelectTrigger className='!h-[45px] w-full'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{data?.findAllCategories.map(({ title, slug }) => (
												<SelectItem value={slug} key={slug}>
													{title}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={control}
						name='returnPeriod'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormLabel className='text-xl'>
									{t("returnPeriodLabel")}
								</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={value => field.onChange(value)}
									>
										<SelectTrigger className='!h-[45px] w-full'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(ReturnType).map(element => (
												<SelectItem value={element[1]} key={element[1]}>
													{tEnums(`returnTypes.${element[1]}`)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>
					<div className='space-y-5'>
						<div className='flex items-center justify-between'>
							<Heading title={t("location")} className='font-bold' />
							{user?.country && user.region && (
								<FullTextTooltip text={t("insertLocationButtonTooltip")}>
									<Icon
										icon={"ic:round-content-paste"}
										className='text-accent hover:text-accent/90 cursor-pointer'
										width={23}
										onClick={() => {
											setValue("country", user.country as Alpha2Code)
											setValue("region", user.region as Alpha2Code)
										}}
									/>
								</FullTextTooltip>
							)}
						</div>
						<FormField
							control={control}
							name='country'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<CountryCombobox
											value={field.value}
											onValueChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='region'
							render={({ field }) => (
								<FormItem className='w-full'>
									<FormControl>
										<RegionCombobox
											country={country as Alpha2Code}
											value={field.value}
											onValueChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<div className='space-y-2'>
							<Heading title={t("endDate")} className='font-bold' />
							<div className='flex gap-x-5'>
								<FormField
									control={control}
									name='expiresDate'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormControl>
												<DayPicker
													date={field.value}
													onValueChange={field.onChange}
													className='max-w-[200px] rounded-[12px]'
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={control}
									name='expiresTime'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormControl>
												<Input
													type='time'
													step={1}
													value={field.value ?? ""}
													onChange={field.onChange}
													className='bg-background ring-border max-w-[125px]
														appearance-none rounded-[12px]
														[&::-webkit-calendar-picker-indicator]:hidden
														[&::-webkit-calendar-picker-indicator]:appearance-none'
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</div>
				<LotDescriptionEditor />
			</form>
		</Form>
	)
}
