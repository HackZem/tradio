import { cookies } from "next/headers"

import { Lot } from "@/components/features/lot/Lot"

import {
	FindLotByIdDocument,
	FindLotByIdQuery,
} from "@/graphql/generated/output"

import { SERVER_URL } from "@/libs/constants/url.constants"

async function findLot(id: string) {
	try {
		const cookieStore = await cookies()

		const cookieHeader = cookieStore
			.getAll()
			.map(c => `${c.name}=${c.value}`)
			.join("; ")

		const query = FindLotByIdDocument.loc?.source.body

		const response = await fetch(SERVER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader,
			},
			body: JSON.stringify({
				query,
				variables: {
					id,
				},
			}),
		})

		const data = await response.json()

		return {
			lot: data.data.findLotById as FindLotByIdQuery["findLotById"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving lot")
	}
}

export default async function LotPage({
	params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
	const { id } = await params

	const { lot } = await findLot(id)

	return (
		<div className='mx-auto w-full max-w-[1340px]'>
			<Lot lot={lot} />
		</div>
	)
}
