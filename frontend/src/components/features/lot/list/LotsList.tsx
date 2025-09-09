"use client"

import { EmptyState } from "@/components/ui/elements/EmptyState"

import { FindAllLotsQuery } from "@/graphql/generated/output"

import { cn } from "@/utils/tw-merge"

import { LotCard } from "../card/LotCard"

interface LotsListProps {
	lots: FindAllLotsQuery["findAllLots"]["lots"]
	className?: string
}

export function LotsList({ lots, className }: LotsListProps) {
	return lots.length ? (
		<div
			className={cn(
				"grid grid-cols-2 gap-5 xl:grid-cols-3 2xl:grid-cols-4",
				className,
			)}
		>
			{lots.map(lot => (
				<LotCard lot={lot} key={lot.id} />
			))}
		</div>
	) : (
		<EmptyState />
	)
}
