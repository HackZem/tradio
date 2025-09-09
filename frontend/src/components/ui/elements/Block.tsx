import { PropsWithChildren } from "react"

import { cn } from "@/utils/tw-merge"

import { Heading } from "./Heading"

interface BlockProps {
	heading: string
	className?: string
}

export function Block({
	children,
	heading,
	className,
}: PropsWithChildren<BlockProps>) {
	return (
		<div className={"space-y-5"}>
			<Heading size={"lg"} title={heading} />
			<div className={className}>{children}</div>
		</div>
	)
}
