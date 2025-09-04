"use client"

import { Chip } from "@/components/ui/elements/Chip"

import { FindAllCategoriesQuery } from "@/graphql/generated/output"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

interface CategoryChipsProps {
	categoriesData: FindAllCategoriesQuery["findAllCategories"]
}

export function CategoryChips({ categoriesData }: CategoryChipsProps) {
	const { categories, removeCategory } = useLotFiltersStore()

	return (
		<div className='flex flex-wrap gap-2.5'>
			{categories.map(slug => (
				<Chip
					title={
						categoriesData.find(category => category.slug === slug)?.title ?? ""
					}
					onDelete={() => removeCategory(slug)}
					key={slug}
				/>
			))}
		</div>
	)
}
