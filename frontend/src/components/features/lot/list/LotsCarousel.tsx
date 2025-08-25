"use client"

import _ from "lodash"
import { useEffect, useRef, useState } from "react"

import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/common/Carousel"
import { Block } from "@/components/ui/elements/Block"

import {
	FindAllLotsQuery,
	useFindAllLotsQuery,
} from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"
import { useItemsPerSlide } from "@/hooks/useItemsPerSlide"

import { cn } from "@/utils/tw-merge"

import { LotCard } from "./LotCard"

interface LotsCarouselProps {
	heading: string
	lots: FindAllLotsQuery["findAllLots"]
	rows?: number
}

export function LotsCarousel({ heading, lots, rows = 1 }: LotsCarouselProps) {
	const { user } = useCurrent()

	const [lotsList, setLotsList] =
		useState<FindAllLotsQuery["findAllLots"]>(lots)

	const [hasMore, setHasMore] = useState<boolean>(true)

	const { data, fetchMore } = useFindAllLotsQuery({
		variables: { filters: { skip: lotsList.length, take: 5 * rows } },
		fetchPolicy: "network-only",
		skip: !!lots,
	})

	const [api, setApi] = useState<CarouselApi>()

	const itemsPerSlide = useItemsPerSlide()

	const sliced = _.chunk(lotsList, itemsPerSlide * rows)

	const handleScrollEnd = () => {
		if (!api) return

		if (!hasMore) return

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		const currentIndex = api.selectedScrollSnap()

		const totalSlides = api.scrollSnapList().length

		if (currentIndex >= totalSlides - 1) {
			timeoutRef.current = setTimeout(async () => {
				const { data: newData } = await fetchMore({
					variables: { skip: lotsList.length, take: 5 * rows },
				})

				if (newData.findAllLots.length < 5 * rows) {
					setHasMore(false)
				}

				setLotsList(prev => [...prev, ...newData.findAllLots])
			}, 20)
		}
	}

	useEffect(() => {
		if (!api) return
		api.on("settle", handleScrollEnd)
		return () => {
			api.off("settle", handleScrollEnd)
		}
	}, [api, data, handleScrollEnd])

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	return (
		<Block heading={heading} className='px-8'>
			<Carousel className='-m-4' setApi={setApi}>
				<CarouselContent className={"flex p-4"}>
					{sliced.map((slice, i) => (
						<CarouselItem
							className={cn(
								"grid basis-full grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
								`grid-rows-${rows}`,
								i === sliced.length - 1 && "mr-5",
							)}
							key={i}
						>
							{slice.map(lot => (
								<LotCard
									className={"max-w-[400px]"}
									lot={lot}
									key={lot.id}
									currentUserUsername={user?.username ?? ""}
								/>
							))}
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious
					className='size-12 translate-x-4 shadow-md'
					variant={"ghost"}
				/>
				<CarouselNext
					className='size-12 -translate-x-4 shadow-md'
					variant={"ghost"}
				/>
			</Carousel>
		</Block>
	)
}
