"use client"

import _ from "lodash"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import {
	FindAllLotsQuery,
	useFindAllLotsQuery,
} from "@/graphql/generated/output"

import { LotCardSkeleton } from "../card/LotCard"

import { LotsList } from "./LotsList"

interface LotsContentProps {
	lots: FindAllLotsQuery["findAllLots"]
}

export function LotsContent({ lots }: LotsContentProps) {
	const searchParams = useSearchParams()
	const query = searchParams.get("query")
	const categories = searchParams.getAll("category")

	const [lotsList, setLotsList] = useState<FindAllLotsQuery["findAllLots"]>(
		lots ?? [],
	)
	const [hasMore, setHasMore] = useState<boolean>(true)

	const { data, fetchMore } = useFindAllLotsQuery({
		variables: {
			filters: {
				query,
				categorySlugs: categories,
				take: 20,
				skip: 0,
			},
		},
		fetchPolicy: "network-only",
	})

	useEffect(() => {
		if (data?.findAllLots) {
			setLotsList(data.findAllLots)
			setHasMore(data.findAllLots.length >= 20)
		}
	}, [data, query])

	async function fetchMoreLots() {
		if (!hasMore) return

		setTimeout(async () => {
			const { data: newData } = await fetchMore({
				variables: {
					filters: {
						query,
						categorySlugs: categories,
						take: 20,
						skip: lotsList.length,
					},
				},
			})

			if (newData.findAllLots.length) {
				setLotsList(prev => [...prev, ...newData.findAllLots])
			} else {
				setHasMore(false)
			}
		}, 400)
	}

	return (
		<>
			<InfiniteScroll
				dataLength={lotsList.length}
				next={fetchMoreLots}
				hasMore={hasMore}
				loader={
					<div className='grid grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
						{_.times(10, i => (
							<LotCardSkeleton key={i} />
						))}
					</div>
				}
			>
				<LotsList lots={lotsList} />
			</InfiniteScroll>
		</>
	)
}
