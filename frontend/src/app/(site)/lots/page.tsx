import { LotsContent } from "@/components/features/lot/list/LotsContent"
import { LotFilters } from "@/components/features/lot/list/filters/LotFilters"
import { LotSort } from "@/components/features/lot/list/filters/LotSort"

import {
	FindAllLotsDocument,
	FindAllLotsQuery,
} from "@/graphql/generated/output"

import { SERVER_URL } from "@/libs/constants/url.constants"

async function findAllLots() {
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
					},
				},
			}),
		})

		const data = await response.json()

		return {
			lots: data.data.findAllLots
				.lots as FindAllLotsQuery["findAllLots"]["lots"],
			maxPrice: data.data.findAllLots
				.maxPrice as FindAllLotsQuery["findAllLots"]["maxPrice"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving lots")
	}
}

export default async function LotsPage() {
	const { lots, maxPrice } = await findAllLots()

	return (
		<div
			className='mx-auto flex w-full max-w-[1610px] justify-center gap-x-[30px]
				overflow-visible pt-6'
		>
			<div className='w-full max-w-[300px] space-y-5'>
				<LotSort />
				<LotFilters maxPrice={maxPrice ?? 0} />
			</div>
			<LotsContent lots={lots} />
		</div>
	)
}
