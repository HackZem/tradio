"use client"

import { Block } from "@/components/ui/elements/Block"

import { FindAllLotsQuery } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { cn } from "@/utils/tw-merge"

import { LotCard } from "./LotCard"

interface LotsListProps {
	heading: string
	lots: FindAllLotsQuery["findAllLots"]
	rows?: number
}

export function LotsList({ heading, lots, rows = 1 }: LotsListProps) {
	const { user } = useCurrent()

	return (
		<Block heading={heading}>
			<div className={cn("grid grid-cols-5 gap-5", `grid-rows-${rows}`)}>
				{lots.map(lot => (
					<LotCard
						lot={lot}
						key={lot.id}
						currentUserUsername={user?.username ?? ""}
					/>
				))}
			</div>
		</Block>
	)
}
