"use client"

import { Chip } from "@/components/ui/elements/Chip"
import { FindAllCategoriesQuery } from "@/graphql/generated/output"
import { ROUTES } from "@/libs/constants/routes.constants"
import { useRouter, useSearchParams } from "next/navigation"

interface CategoryChipsProps {
	categories: FindAllCategoriesQuery["findAllCategories"]
}

export function CategoryChips({ categories }: CategoryChipsProps) {
	const searchParams = useSearchParams()
	const router = useRouter()

	const categorySlugs = searchParams.getAll("category")

	function deleteCategory(slug: string) {
		const params = new URLSearchParams(searchParams.toString())

		params.delete("category", slug)

		router.push(ROUTES.LOTS + "?" + params.toString())
	}

	return (
		<div className='flex flex-wrap gap-2.5'>
			{categorySlugs.map(slug => (
				<Chip
					title={
						categories.find(category => category.slug === slug)?.title ?? ""
					}
					onDelete={() => deleteCategory(slug)}
					key={slug}
				/>
			))}
		</div>
	)
}
