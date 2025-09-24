"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify-icon/react"
import { JSONContent } from "@tiptap/react"
import { format, set, startOfDay } from "date-fns"
import { Alpha2Code } from "i18n-iso-countries"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/common/Button"
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
import { Block } from "@/components/ui/elements/Block"
import { CountryCombobox } from "@/components/ui/elements/CountryCombobox"
import { DayPicker } from "@/components/ui/elements/DayPicker"
import { FullTextTooltip } from "@/components/ui/elements/FullTextTooltip"
import { Heading } from "@/components/ui/elements/Heading"
import { RegionCombobox } from "@/components/ui/elements/RegionCombobox"
import { FilterAmountInput } from "@/components/ui/elements/filters/FilterAmountInput"

import {
	ConditionType,
	FindLotByIdQuery,
	LotType,
	ReturnType,
	useCreateLotMutation,
	useFindAllCategoriesQuery,
	useUpdateLotMutation,
} from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { ROUTES } from "@/libs/constants/routes.constants"

import { cn } from "@/utils/tw-merge"

import { LotPhotosEditor } from "./LotPhotosEditor"
import { LotDescriptionEditor } from "./description/LotDescriptionEditor"
import lotSchema, { TLotSchema } from "@/schemas/lot/lot.schema"

interface TLotFormProps {
	initialLot?: FindLotByIdQuery["findLotById"]
	isEditing?: boolean
}

export function LotForm({ initialLot, isEditing = false }: TLotFormProps) {
	const t = useTranslations("lot.form")
	const tEnums = useTranslations("enums")

	const router = useRouter()

	const { data: categories } = useFindAllCategoriesQuery()

	const form = useForm<TLotSchema>({
		resolver: zodResolver(lotSchema),
		defaultValues: {
			title: initialLot?.title ?? "",
			condition: initialLot?.condition,
			country: initialLot?.country,
			region: initialLot?.region,
			returnPeriod: initialLot?.returnPeriod,
			categorySlug: initialLot?.categorySlug,
			type: initialLot?.type,
			buyNowPrice: initialLot?.buyNowPrice?.toString(),
			description: initialLot?.description && initialLot.description,
			photos: initialLot?.photos,
			price: initialLot?.currentPrice?.toString(),
			expiresDate: initialLot?.expiresAt && startOfDay(initialLot?.expiresAt),
			expiresTime: initialLot?.expiresAt
				? format(initialLot?.expiresAt, "HH:mm:ss")
				: "",
		},
	})

	const { control, watch, setValue, handleSubmit, getValues, reset } = form

	const { isDirty } = form.formState

	const [update, { loading: isUpdateLotLoading }] = useUpdateLotMutation({
		onCompleted() {
			form.reset(form.getValues())
			toast.success(t("successUpdatedLot"))
		},
		onError() {
			toast.error(t("errorUpdatedLot"))
		},
	})

	const [create, { loading: isCreateLotLoading, data: isCreated }] =
		useCreateLotMutation({
			onCompleted() {
				form.reset(form.getValues())
				router.replace(ROUTES.LOTS)
				toast.success(t("successCreatedLot"))
			},
			onError() {
				toast.error(t("errorCreatedLot"))
			},
		})

	const isLoading = isCreateLotLoading || isUpdateLotLoading
	const isEdited = !!isCreated

	const isCanEdit = (initialLot?._count.bids ?? 0) <= 0 || !isEditing

	const { user } = useCurrent()

	const country = watch("country")
	const type = watch("type")

	async function onSubmit(data: TLotSchema) {
		const { description, photos, type, price } = data

		const buyNowPriceOrUndefined =
			type === LotType.Mixed ? +data.buyNowPrice! : undefined

		const descriptionOrUndefined = description || undefined

		let expiresAt: Date | undefined
		if (type !== LotType.Buynow && data.expiresTime && data.expiresDate) {
			const [hours, minutes, seconds] = data.expiresTime.split(":").map(Number)

			expiresAt = set(data.expiresDate, { hours, minutes, seconds })
		}

		const photosData = []
		for (const photo of photos!) {
			if (photo.key.startsWith("blob:")) {
				const result = await fetch(photo.key)
				const blob = await result.blob()

				const extension = blob.type.split("/")[1]

				const file = new File([blob], `file.${extension}`, { type: blob.type })

				URL.revokeObjectURL(photo.key)

				photosData.push({ key: undefined, file, order: photo.order })
			} else {
				photosData.push({ key: photo.key, file: undefined, order: photo.order })
			}
		}

		const common = {
			title: data.title,
			condition: data.condition,
			country: data.country,
			region: data.region,
			returnPeriod: data.returnPeriod,
			categorySlug: data.categorySlug,
			type,
			buyNowPrice: buyNowPriceOrUndefined,
			description: descriptionOrUndefined,
			expiresAt,
			photos: photosData,
			price: +price,
		}

		isEditing
			? initialLot &&
				update({
					variables: {
						data: { ...common, lotId: initialLot.id },
					},
				})
			: create({
					variables: {
						data: common,
					},
				})
	}

	return (
		<Form {...form}>
			<form
				className='space-y-[50px]'
				onSubmit={handleSubmit(onSubmit, error => console.log(error))}
			>
				<div className='flex gap-x-5'>
					<FormField
						control={control}
						name='photos'
						render={({ field }) => (
							<LotPhotosEditor
								photos={field.value ?? []}
								onChange={photos =>
									field.onChange(
										photos
											.sort((a, b) => a.order - b.order)
											.map((p, i) => ({ ...p, order: i })),
									)
								}
							/>
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
												disabled={!isCanEdit}
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
												disabled={!isCanEdit}
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
												disabled={!isCanEdit}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='buyNowPrice'
								render={({ field }) => (
									<FormItem
										className={cn(type !== LotType.Mixed && "invisible")}
									>
										<FormLabel className='text-xl'>
											{t("buyNowPriceLabel")}
										</FormLabel>
										<FormControl>
											<FilterAmountInput
												{...field}
												value={field.value ?? ""}
												className='h-[45px] w-full rounded-[12px]'
												disabled={!isCanEdit}
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
									<FormLabel className='text-xl'>
										{t("categoryLabel")}
									</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={value => field.onChange(value)}
											disabled={!isCanEdit}
										>
											<SelectTrigger className='!h-[45px] w-full'>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{categories?.findAllCategories.map(
													({ title, slug }) => (
														<SelectItem value={slug} key={slug}>
															{title}
														</SelectItem>
													),
												)}
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
											disabled={!isCanEdit}
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
								{user?.country && user.region && isCanEdit && (
									<FullTextTooltip text={t("insertLocationButtonTooltip")}>
										<Icon
											icon={"ic:round-content-paste"}
											className='text-accent hover:text-accent/90
												cursor-pointer'
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
												disabled={!isCanEdit}
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
												disabled={!isCanEdit}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							{type !== LotType.Buynow && (
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
															disabled={!isCanEdit}
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
															disabled={!isCanEdit}
															className='bg-background ring-border max-w-[125px]
																appearance-none rounded-[12px] text-center
																[&::-webkit-calendar-picker-indicator]:hidden
																[&::-webkit-calendar-picker-indicator]:appearance-none'
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<Block heading={t("description.heading")}>
					<FormField
						control={control}
						name='description'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<LotDescriptionEditor
										description={field.value as JSONContent}
										onChange={field.onChange}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</Block>
				<div className='ml-auto flex w-full justify-end gap-x-[15px]'>
					<Button className='w-full max-w-[150px]' variant={"outline"}>
						{t("cancelButton")}
					</Button>
					<Button
						className='w-full max-w-[150px]'
						disabled={isLoading || !isDirty || isEdited}
						type='submit'
					>
						{isEditing ? t("editLotButton") : t("placeLotButton")}
					</Button>
				</div>
			</form>
		</Form>
	)
}
