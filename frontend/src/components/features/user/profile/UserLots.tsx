"use client"

import _ from "lodash"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/common/Button"
import { Block } from "@/components/ui/elements/Block"

import {
	FindAllLotsQuery,
	useFindAllLotsLazyQuery,
} from "@/graphql/generated/output"

import { LotCardSkeleton } from "../../lot/card/LotCard"
import { LotsList } from "../../lot/list/LotsList"

interface UserLotsProps {
	initialLots: FindAllLotsQuery["findAllLots"]["lots"]
	username: string
}

export function UserLots({ initialLots, username }: UserLotsProps) {
	const t = useTranslations("user.profile.lots")

	const [lots, setLots] =
		useState<FindAllLotsQuery["findAllLots"]["lots"]>(initialLots)

	const [hasMore, setHasMore] = useState<boolean>(true)

	useEffect(() => {
		setLots(initialLots)

		if (initialLots.length < 4) {
			setHasMore(false)
		}
	}, [initialLots])

	const [fetchMore, { data, loading: lotsLoading }] = useFindAllLotsLazyQuery({
		variables: {
			filters: { query: "@" + username, skip: 4, take: 16 },
		},
	})

	useEffect(() => {
		const newLots = data?.findAllLots?.lots

		if (!newLots) return

		setLots(prev => [...prev, ...data.findAllLots.lots])

		if (newLots.length < 16) {
			setHasMore(false)
		}
	}, [data])

	function handleFetchMoreLots() {
		fetchMore({
			variables: {
				filters: { query: "@" + username, skip: lots.length, take: 16 },
			},
		})
	}

	return (
		<Block heading={t("heading")} className='flex flex-col items-center'>
			<LotsList lots={lots} className='w-full' />
			{lotsLoading && (
				<div
					className='mt-5 grid grid-cols-2 gap-5 xl:grid-cols-3 2xl:grid-cols-4'
				>
					{_.times(16).map((_, i) => (
						<LotCardSkeleton key={i} />
					))}
				</div>
			)}
			{hasMore && (
				<Button
					variant={"outline"}
					className='mt-5 w-full max-w-[200px]'
					onClick={() => handleFetchMoreLots()}
				>
					{t("showMoreButton")}
				</Button>
			)}
		</Block>
	)
}
