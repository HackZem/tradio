"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { ComponentProps } from "react"

import { cn } from "@/utils/tw-merge"

function Checkbox({
	className,
	...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			data-slot='checkbox'
			className={cn(
				`peer border-black border-2 dark:bg-input/30
				data-[state=checked]:text-primary-foreground
				data-[state=checked]:border-black focus-visible:border-ring
				focus-visible:ring-ring/50 aria-invalid:ring-destructive/20
				dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
				size-[16px] shrink-0 rounded-[4px] shadow-xs transition-shadow
				outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed
				disabled:opacity-50`,
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot='checkbox-indicator'
				className='flex items-center justify-center transition-none'
			>
				<div className='rounded-[2px] aspect-square w-2 bg-black' />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export { Checkbox }
