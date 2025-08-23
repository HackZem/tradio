import { getTranslations } from "next-intl/server"

import { CategoriesList } from "@/components/features/category/CategoriesList"
import { LotsList } from "@/components/features/lot/list/LotsList"

import {
	FindAllLotsDocument,
	FindAllLotsQuery,
	SortBy,
	SortOrder,
} from "@/graphql/generated/output"

import { SERVER_URL } from "@/libs/constants/url.constants"

async function findTopLots() {
	try {
		const query = FindAllLotsDocument.loc?.source.body

		const response = await fetch(SERVER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables: {
					filters: {
						take: 10,
						skip: 0,
						sortBy: SortBy.Bids,
						sortOrder: SortOrder.Desc,
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots as FindAllLotsQuery["findAllLots"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving lots")
	}
}

async function findEndingSoonLots() {
	try {
		const query = FindAllLotsDocument.loc?.source.body

		const response = await fetch(SERVER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables: {
					filters: {
						take: 5,
						skip: 0,
						sortBy: SortBy.ExpiresAt,
						sortOrder: SortOrder.Asc,
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots as FindAllLotsQuery["findAllLots"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving lots")
	}
}

async function findNewLots() {
	try {
		const query = FindAllLotsDocument.loc?.source.body

		const response = await fetch(SERVER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables: {
					filters: {
						take: 5,
						skip: 0,
						sortBy: SortBy.CreatedAt,
						sortOrder: SortOrder.Desc,
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots as FindAllLotsQuery["findAllLots"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving lots")
	}
}

export default async function HomePage() {
	const t = await getTranslations("home")

	const { lots: topLots } = await findTopLots()
	const { lots: endingSoonLots } = await findEndingSoonLots()
	const { lots: newLots } = await findNewLots()

	return (
		<div className='flex justify-center' suppressHydrationWarning>
			<div className='mb-[100px] w-full max-w-[1610px] space-y-[100px]'>
				<CategoriesList />
				<LotsList heading={t("topLotsHeading")} lots={topLots} rows={2} />
				<LotsList heading={t("endingSoonLotsHeading")} lots={endingSoonLots} />
				<LotsList heading={t("newLotsHeading")} lots={newLots} />
			</div>
		</div>
	)
}
