"use client"

import { FindLotByIdQuery } from "@/graphql/generated/output"

interface LotDescriptionProps {
	description: FindLotByIdQuery["findLotById"]["description"]
}

export function LotDescription({ description }: LotDescriptionProps) {
	return <div>{description?.stringify?.()}</div>
}
