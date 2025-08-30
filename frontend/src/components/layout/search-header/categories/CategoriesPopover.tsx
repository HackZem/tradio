"use client"

import { PropsWithChildren, useEffect } from "react"

import { Checkbox } from "@/components/ui/common/Checkbox"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/common/Popover"

import { FindAllCategoriesQuery } from "@/graphql/generated/output"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Form, FormField, FormItem } from "@/components/ui/common/Form"
import _ from "lodash"
import { ROUTES } from "@/libs/constants/routes.constants"

interface CategoriesPopoverProps {
	categories: FindAllCategoriesQuery["findAllCategories"]
}

interface FormValues {
	categories: FindAllCategoriesQuery["findAllCategories"][number]["slug"][]
}

export function CategoriesPopover({
	categories,
	children,
}: PropsWithChildren<CategoriesPopoverProps>) {
	const searchParams = useSearchParams()

	const router = useRouter()

	const pathname = usePathname()

	const form = useForm<FormValues>({
		defaultValues: {
			categories: searchParams.getAll("category"),
		},
	})

	const { watch, control, setValue } = form

	const selectedCategories = watch("categories")

	useEffect(() => {
		const urlCategories = searchParams.getAll("category")
		setValue("categories", urlCategories)
	}, [searchParams, setValue])

	useEffect(() => {
		const newParams = new URLSearchParams(searchParams.toString())
		newParams.delete("category")

		if (!selectedCategories.length && !pathname.includes(ROUTES.LOTS)) return

		selectedCategories?.forEach(category =>
			newParams.append("category", category),
		)
		router.push(ROUTES.LOTS + "?" + newParams.toString())
	}, [selectedCategories])

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent align='start' className='w-full max-w-[600px]'>
				<Form {...form}>
					<form className='grid grid-cols-2 gap-x-[50px] gap-y-5'>
						{categories.map((category, i) => (
							<FormField
								control={control}
								name='categories'
								key={category.slug}
								render={({ field }) => {
									const isChecked = field.value.includes(category.slug) ?? false

									return (
										<FormItem
											className='flex items-center justify-between gap-x-3
												[&>*]:cursor-pointer cursor-pointer'
											key={i}
											onClick={e => {
												if (e.target === e.currentTarget) {
													const newChecked = !isChecked
													if (newChecked) {
														field.onChange([...field.value, category.slug])
													} else {
														field.onChange(
															field.value.filter(v => v !== category.slug),
														)
													}
												}
											}}
										>
											<label
												className='text-xl font-bold'
												htmlFor={category.slug}
											>
												{category.title}
											</label>
											<Checkbox
												id={category.slug}
												checked={isChecked}
												onCheckedChange={checked => {
													if (checked) {
														field.onChange([...field.value, category.slug])
													} else {
														field.onChange(
															field.value.filter(v => v !== category.slug),
														)
													}
												}}
											/>
										</FormItem>
									)
								}}
							/>
						))}
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}
