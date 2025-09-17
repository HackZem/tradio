import { getTranslations } from "next-intl/server"

import { CategoriesList } from "@/components/features/category/CategoriesList"
import { LotsCarousel } from "@/components/features/lot/carousel/LotsCarousel"

import {
	FindAllLotsDocument,
	FindAllLotsQuery,
	SortBy,
	SortOrder,
} from "@/graphql/generated/output"

import { SERVER_URL } from "@/libs/constants/url.constants"

const FIND_TOP_LOTS_FILTERS = {
	sortBy: SortBy.Bids,
	sortOrder: SortOrder.Desc,
} as const

const FIND_ENDING_SOON_LOTS_FILTERS = {
	sortBy: SortBy.ExpiresAt,
	sortOrder: SortOrder.Asc,
} as const

const FIND_NEW_LOTS_FILTERS = {
	sortBy: SortBy.CreatedAt,
	sortOrder: SortOrder.Desc,
} as const

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
						take: 20,
						skip: 0,
						...FIND_TOP_LOTS_FILTERS,
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots
				.lots as FindAllLotsQuery["findAllLots"]["lots"],
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
						take: 10,
						skip: 0,
						...FIND_ENDING_SOON_LOTS_FILTERS,
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots
				.lots as FindAllLotsQuery["findAllLots"]["lots"],
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
						take: 10,
						skip: 0,
						...FIND_NEW_LOTS_FILTERS,
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots
				.lots as FindAllLotsQuery["findAllLots"]["lots"],
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
			<div className='mb-[100px] max-w-[1610px] space-y-[100px]'>
				<CategoriesList />
				<LotsCarousel
					heading={t("topLotsHeading")}
					lots={topLots}
					rows={2}
					filters={FIND_TOP_LOTS_FILTERS}
				/>
				<LotsCarousel
					heading={t("endingSoonLotsHeading")}
					lots={endingSoonLots}
					filters={FIND_ENDING_SOON_LOTS_FILTERS}
				/>
				<LotsCarousel
					heading={t("newLotsHeading")}
					lots={newLots}
					filters={FIND_NEW_LOTS_FILTERS}
				/>
			</div>
		</div>
	)
}

