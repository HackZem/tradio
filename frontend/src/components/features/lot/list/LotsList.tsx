"use client"

import { EmptyState } from "@/components/ui/elements/EmptyState"

import { FindAllLotsQuery } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { LotCard } from "../card/LotCard"

interface LotsListProps {
	lots: FindAllLotsQuery["findAllLots"]["lots"]
}

export function LotsList({ lots }: LotsListProps) {
	const { user } = useCurrent()

	return lots.length ? (
		<div className='grid grid-cols-2 gap-5 p-4 xl:grid-cols-3 2xl:grid-cols-4'>
			{lots.map(lot => (
				<LotCard
					lot={lot}
					currentUserUsername={user?.username ?? ""}
					key={lot.id}
				/>
			))}
		</div>
	) : (
		<EmptyState />
	)
}
