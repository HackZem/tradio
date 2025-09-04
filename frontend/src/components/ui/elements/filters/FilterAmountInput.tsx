"use client"

import { Icon } from "@iconify-icon/react"
import { ComponentProps } from "react"

import { Input } from "../../common/Input"

export function FilterAmountInput(props: ComponentProps<"input">) {
	return (
		<div className='relative'>
			<Icon
				icon='material-symbols:euro-rounded'
				className='text-border absolute top-1/2 right-1 -translate-y-1/2'
				width={20}
			/>
			<Input
				variant={"active"}
				inputMode='numeric'
				min={0}
				className='ring-border h-[35px] w-[85px] rounded-[12px] pr-5.5 pl-2
					text-lg'
				{...props}
			/>
		</div>
	)
}
