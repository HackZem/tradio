"use client"

import { Icon } from "@iconify-icon/react"
import { ComponentProps } from "react"

import { cn } from "@/utils/tw-merge"

import { Input } from "../../common/Input"

export function FilterAmountInput({
	className,
	...props
}: ComponentProps<"input">) {
	return (
		<div className='relative'>
			<Input
				variant={"active"}
				inputMode='numeric'
				min={0}
				className={cn(
					"ring-border pl-2text-lg h-[35px] w-[85px] rounded-[12px] pr-6.5",
					className,
				)}
				{...props}
			/>
			<Icon
				icon='material-symbols:euro-rounded'
				className='text-border absolute top-1/2 right-2 -translate-y-1/2'
				width={20}
			/>
		</div>
	)
}
