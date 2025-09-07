"use client"

import _ from "lodash"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { Card } from "@/components/ui/common/Card"

import { FindLotByIdQuery } from "@/graphql/generated/output"

import { getMediaSource } from "@/utils/get-media-source"

interface LotPhotosPreviewProps {
	photos: FindLotByIdQuery["findLotById"]["photos"]
}

export function LotPhotosPreview({ photos }: LotPhotosPreviewProps) {
	const previewImageRef = useRef<HTMLDivElement>(null)

	const [scrollImagesHeight, setScrollImagesHeight] = useState<number>()

	useEffect(() => {
		if (!previewImageRef.current) return

		const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				setScrollImagesHeight(entry.contentRect.height)
			}
		})

		observer.observe(previewImageRef.current)

		return () => observer.disconnect()
	}, [])

	return (
		<div
			className='grid w-full grid-cols-[1fr_3fr] justify-between'
			style={{
				height: scrollImagesHeight,
			}}
		>
			{/* idea: we can make each element with absolute for shadow */}
			<div
				className='scrollbar-hidden relative flex w-full flex-col gap-y-2.5
					overflow-y-auto px-[12px]'
			>
				{_.times(6).map((photo, i) => (
					<Card
						className='relative aspect-square w-full shrink-0 overflow-hidden'
					>
						<Image
							src={getMediaSource("")}
							alt={`Image ${++i}`}
							fill
							className='object-contain'
						/>
					</Card>
				))}
			</div>
			<div className='aspect-square w-full max-w-[630px]' ref={previewImageRef}>
				<Card className='relative h-full w-full overflow-hidden'>
					<Image
						src={getMediaSource("")}
						alt='Product preview'
						fill
						className='object-contain'
					/>
				</Card>
			</div>
		</div>
	)
}
