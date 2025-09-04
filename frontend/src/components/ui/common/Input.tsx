import { cva, VariantProps } from "class-variance-authority"
import { ComponentProps } from "react"

import { cn } from "@/utils/tw-merge"

const inputVariants = cva(
	`file:text-foreground placeholder:text-muted-foreground selection:bg-primary
	selection:text-primary-foreground dark:bg-input/30
	aria-invalid:ring-destructive dark:aria-invalid:ring-destructive/40
	aria-invalid:border-destructive focus-visible:border-ring
	focus-visible:ring-ring! hover:ring-primary flex h-[2.875rem] w-full min-w-0
	rounded-full px-3 py-1 pl-4 text-xl transition-all outline-none
	file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm
	file:font-medium hover:brightness-90 hover:filter focus-visible:bg-transparent
	focus-visible:ring-[2px] disabled:pointer-events-none
	disabled:cursor-not-allowed disabled:opacity-50`,
	{
		variants: {
			variant: {
				default: `hover:bg-input bg-input
				[&:not(:placeholder-shown)]:bg-transparent
				[&:not(:placeholder-shown)]:ring-[2px]
				[&:not(:placeholder-shown):not(:focus-visible)]:ring-inset`,
				active: "border-ring bg-transparent ring-[2px]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

function Input({
	className,
	type,
	variant,
	...props
}: ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
	return (
		<input
			type={type}
			data-slot='input'
			placeholder=''
			className={cn(inputVariants({ variant, className }))}
			{...props}
		/>
	)
}

export { Input }
