"use client"

import { PropsWithChildren } from "react"

import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from "@/components/ui/common/Tooltip"

interface FullTextTooltipProps {
	text: string
}

export function FullTextTooltip({
	children,
	text,
}: PropsWithChildren<FullTextTooltipProps>) {
	return (
		<Tooltip>
			<TooltipTrigger asChild className='cursor-pointer'>
				<div>{children}</div>
			</TooltipTrigger>
			<TooltipContent align='start' side='bottom'>
				<p>{text}</p>
			</TooltipContent>
		</Tooltip>
	)
}
