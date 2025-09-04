"use client"

import _ from "lodash"
import { PropsWithChildren } from "react"
import { ControllerRenderProps, useForm } from "react-hook-form"

import { Checkbox } from "@/components/ui/common/Checkbox"
import { Form, FormField, FormItem } from "@/components/ui/common/Form"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/common/Popover"

import { FindAllCategoriesQuery } from "@/graphql/generated/output"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

interface CategoriesPopoverProps {
	categoriesData: FindAllCategoriesQuery["findAllCategories"]
}

interface FormValues {
	categories: FindAllCategoriesQuery["findAllCategories"][number]["slug"][]
}

export function CategoriesPopover({
	categoriesData,
	children,
}: PropsWithChildren<CategoriesPopoverProps>) {
	const { categories, addCategory, removeCategory } = useLotFiltersStore()

	const form = useForm<FormValues>({
		values: {
			categories,
		},
	})

	const { control } = form

	function handleCategoryChange(
		field: ControllerRenderProps<FormValues, "categories">,
		checked: boolean,
		slug: string,
	) {
		if (checked) {
			field.onChange([...field.value, slug])
			addCategory(slug)
		} else {
			field.onChange(field.value.filter(v => v !== slug))
			removeCategory(slug)
		}
	}

	// well well well, i use the form with the store :)

	return (
		<Popover>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent align='start' className='w-full max-w-[600px]'>
				<Form {...form}>
					<form className='grid grid-cols-2 gap-x-[50px] gap-y-5'>
						{categoriesData.map((category, i) => (
							<FormField
								control={control}
								name='categories'
								key={category.slug}
								render={({ field }) => {
									const isChecked = field.value.includes(category.slug) ?? false

									return (
										<FormItem
											className='flex cursor-pointer items-center
												justify-between gap-x-3 [&>*]:cursor-pointer'
											key={i}
											onClick={e => {
												if (e.target === e.currentTarget) {
													const newChecked = !isChecked
													handleCategoryChange(field, newChecked, category.slug)
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
													handleCategoryChange(field, !!checked, category.slug)
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
