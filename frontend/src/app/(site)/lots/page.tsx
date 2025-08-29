import { LotsContent } from "@/components/features/lot/list/LotsContent"

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
						take: 50,
						skip: 0,
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

export default async function LotsPage() {
	const { lots } = await findAllLots()

	return (
		<div className='mx-auto max-w-[1610px] overflow-visible pt-6'>
			<LotsContent lots={lots} />
		</div>
	)
}
