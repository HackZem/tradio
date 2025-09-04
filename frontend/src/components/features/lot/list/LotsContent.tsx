"use client"

import _ from "lodash"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroll-component"

import {
	FindAllLotsQuery,
	useFindAllLotsQuery,
} from "@/graphql/generated/output"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

import { LotCardSkeleton } from "../card/LotCard"

import { LotsList } from "./LotsList"

interface LotsContentProps {
	lots: FindAllLotsQuery["findAllLots"]["lots"]
}

// TODO: problem with sort by BIDS -> identical lots arrive

export function LotsContent({ lots }: LotsContentProps) {
	const { categories, minPrice, maxPrice, ...filters } = useLotFiltersStore()

	const [lotsList, setLotsList] = useState<
		FindAllLotsQuery["findAllLots"]["lots"]
	>(lots ?? [])
	const [hasMore, setHasMore] = useState<boolean>(true)

	const { data, fetchMore } = useFindAllLotsQuery({
		variables: {
			filters: {
				...filters,
				categorySlugs: categories,
				priceRange: { min: minPrice, max: maxPrice },
				take: 20,
				skip: 0,
			},
		},
		fetchPolicy: "network-only",
	})

	useEffect(() => {
		if (data?.findAllLots) {
			setLotsList(data.findAllLots.lots)
			setHasMore(data.findAllLots.lots.length >= 20)
		}
	}, [data])

	async function fetchMoreLots() {
		if (!hasMore) return

		setTimeout(async () => {
			try {
				const { data: newData } = await fetchMore({
					variables: {
						filters: {
							...filters,
							categorySlugs: categories,
							priceRange: { min: minPrice, max: maxPrice },
							take: 20,
							skip: lotsList.length,
						},
					},
				})

				if (newData.findAllLots.lots.length) {
					setLotsList(prev => [...prev, ...newData.findAllLots.lots])
				} else {
					setHasMore(false)
				}
			} catch (err) {
				console.log(err)
			}
		}, 400)
	}

	return (
		<div className='-m-4 w-full'>
			<InfiniteScroll
				dataLength={lotsList.length}
				next={fetchMoreLots}
				hasMore={hasMore}
				loader={
					<div
						className='grid grid-cols-2 gap-5 p-4 xl:grid-cols-3
							2xl:grid-cols-4'
					>
						{_.times(10, i => (
							<LotCardSkeleton key={i} />
						))}
					</div>
				}
			>
				<LotsList lots={lotsList} />
			</InfiniteScroll>
		</div>
	)
}
