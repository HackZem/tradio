import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/common/Button"

import {
	FindAllCategoriesDocument,
	FindAllCategoriesQuery,
} from "@/graphql/generated/output"

import { SERVER_URL } from "@/libs/constants/url.constants"

import { Search } from "./Search"
import { CategoriesPopover } from "./categories/CategoriesPopover"

async function findAllCategories() {
	try {
		const query = FindAllCategoriesDocument.loc?.source.body

		const response = await fetch(SERVER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
			}),
		})

		const data = await response.json()

		return {
			categories: data.data
				.findAllCategories as FindAllCategoriesQuery["findAllCategories"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving categories")
	}
}

export async function SearchHeader() {
	const t = await getTranslations("layout.searchHeader")

	const { categories } = await findAllCategories()

	return (
		<header className='border-border bg-card flex h-[90px] items-center justify-center gap-x-2.5'>
			<CategoriesPopover categories={categories}>
				<Button
					variant='outline'
					size={"default"}
					className='border-black text-black hover:bg-black active:bg-black/70'
				>
					{t("categories")}
				</Button>
			</CategoriesPopover>
			<Search />
		</header>
	)
}
