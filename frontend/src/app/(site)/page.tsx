import { getTranslations } from "next-intl/server"

import { CategoriesList } from "@/components/features/category/CategoriesList"
import { LotsList } from "@/components/features/lot/list/LotsList"

import {
	FindAllLotsDocument,
	FindAllLotsQuery,
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
						take: 5,
						skip: 0,
					},
				},
			}),
			next: {
				revalidate: 30,
			},
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

	const { lots } = await findTopLots()

	return (
		<div className='flex justify-center' suppressHydrationWarning>
			<div className='w-full max-w-[1610px] space-y-[100px]'>
				<CategoriesList />
				<LotsList heading={t("topLotsHeading")} lots={lots} rows={2} />
			</div>
		</div>
	)
}
