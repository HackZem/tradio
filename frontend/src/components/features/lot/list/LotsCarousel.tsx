"use client"

import type { EngineType } from "embla-carousel"
import _ from "lodash"
import { useCallback, useEffect, useRef, useState } from "react"

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
	FindAllLotsQueryVariables,
	useFindAllLotsQuery,
} from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"
import { useItemsPerSlide } from "@/hooks/useItemsPerSlide"

import { cn } from "@/utils/tw-merge"

import { LotCard, LotCardSkeleton } from "./LotCard"

interface LotsCarouselProps {
	heading: string
	lots: FindAllLotsQuery["findAllLots"]
	rows?: number
	filters?: FindAllLotsQueryVariables["filters"]
}

export function LotsCarousel({
	heading,
	lots,
	filters,
	rows = 1,
}: LotsCarouselProps) {
	const { user } = useCurrent()

	const scrollListenerRef = useRef<() => void>(() => undefined)
	const listenForScrollRef = useRef(true)
	const hasMoreToLoadRef = useRef(true)
	const [lotsList, setLotsList] = useState(lots)
	const [hasMore, setHasMore] = useState(true)
	const [loadingMore, setLoadingMore] = useState(false)

	const { fetchMore } = useFindAllLotsQuery({
		variables: {
			filters: { ...filters, skip: lotsList.length, take: 5 * rows },
		},
		fetchPolicy: "network-only",
		skip: !!lots,
	})

	const [api, setApi] = useState<CarouselApi>()

	const itemsPerSlide = useItemsPerSlide()
	const sliced = _.chunk(lotsList, itemsPerSlide * rows)

	const onScroll = useCallback(async (api: CarouselApi) => {
		if (!listenForScrollRef.current || !api) return
		const lastSlide = api.slideNodes().length - 2
		const lastSlideInView = api.slidesInView().includes(lastSlide)
		const loadMore = !loadingMore && lastSlideInView

		if (loadMore) {
			listenForScrollRef.current = false

			const { data: newData } = await fetchMore({
				variables: { skip: lotsList.length, take: 5 * rows },
			})

			if (newData.findAllLots.length < 5 * rows) {
				api.off("scroll", scrollListenerRef.current)
				setHasMore(false)
			}

			setLotsList(prev => [...prev, ...newData.findAllLots])
		}

		setLoadingMore(loadingMore => {
			return loadingMore || lastSlideInView
		})
	}, [])

	const addScrollListener = useCallback(
		(api: CarouselApi) => {
			scrollListenerRef.current = () => onScroll(api)
			api?.on("scroll", scrollListenerRef.current)
		},
		[onScroll],
	)

	useEffect(() => {
		if (!api) return
		addScrollListener(api)

		const onResize = () => api.reInit()
		window.addEventListener("resize", onResize)
		api.on("destroy", () => window.removeEventListener("resize", onResize))
	}, [api, addScrollListener])

	useEffect(() => {
		hasMoreToLoadRef.current = hasMore
	}, [hasMore])

	return (
		<Block heading={heading} className='px-8'>
			<Carousel
				className='-m-4'
				setApi={setApi}
				opts={{
					watchSlides: api => {
						const reloadEmbla = (): void => {
							const oldEngine = api.internalEngine()

							api.reInit()
							const newEngine = api.internalEngine()
							const copyEngineModules: (keyof EngineType)[] = [
								"scrollBody",
								"location",
								"offsetLocation",
								"previousLocation",
								"target",
							]
							copyEngineModules.forEach(engineModule => {
								Object.assign(newEngine[engineModule], oldEngine[engineModule])
							})

							newEngine.translate.to(oldEngine.location.get())
							const { index } = newEngine.scrollTarget.byDistance(0, false)
							newEngine.index.set(index)
							newEngine.animation.start()

							setLoadingMore(false)
							listenForScrollRef.current = true
						}

						const reloadAfterPointerUp = (): void => {
							api.off("pointerUp", reloadAfterPointerUp)
							reloadEmbla()
						}

						const engine = api.internalEngine()

						if (hasMoreToLoadRef.current && engine.dragHandler.pointerDown()) {
							const boundsActive = engine.limit.reachedMax(engine.target.get())
							engine.scrollBounds.toggleActive(boundsActive)
							api.on("pointerUp", reloadAfterPointerUp)
						} else {
							reloadEmbla()
						}
					},
				}}
			>
				<CarouselContent className='flex p-4'>
					{sliced.map((slice, i) => (
						<CarouselItem
							className={cn(
								"grid basis-full grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
								`grid-rows-${rows}`,
								!hasMore && slice.length - 1 === i && "-mr-5",
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

					{hasMore && (
						<CarouselItem
							className={cn(
								`grid-rows-${rows}`,
								"mr-5 grid basis-full grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
							)}
						>
							{_.times(itemsPerSlide * rows, i => (
								<LotCardSkeleton key={i} />
							))}
						</CarouselItem>
					)}
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
