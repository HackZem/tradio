import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/utils/tw-merge"

const buttonVariants = cva(
	`focus-visible:border-ring focus-visible:ring-ring/50
	aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40
	aria-invalid:border-destructive inline-flex shrink-0 items-center
	justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap
	transition-all outline-none focus-visible:ring-[3px]
	disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
	[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
	{
		variants: {
			variant: {
				default: `bg-primary text-primary-foreground hover:bg-primary/90
				active:bg-accent`,
				destructive: `bg-destructive hover:bg-destructive/90
				focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40
				dark:bg-destructive/60 active:bg-destructive text-white`,
				destructiveOutline: `border-destructive text-destructive bg-background
				hover:bg-destructive active:bg-destructive/90 dark:bg-input/30
				dark:border-input dark:hover:bg-input/50 border border-[2px]
				hover:text-white`,
				outline: `border-primary text-primary bg-background hover:bg-primary
				hover:text-primary-foreground active:bg-accent dark:bg-input/30
				dark:border-input dark:hover:bg-input/50 border border-[2px]`,
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: `text-foreground hover:text-primary active:text-accent bg-white
				transition-none`,
			},
			size: {
				default: "rounded-[25px] px-5 py-2.5 text-xl",
				icon: "rounded-full p-2",
			},
		},
		compoundVariants: [
			{
				variant: "outline",
				size: "default",
				class: "py-2",
			},
			{
				variant: "destructiveOutline",
				size: "default",
				class: "py-2",
			},
		],
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean
	}) {
	const Comp = asChild ? Slot : "button"

	return (
		<Comp
			data-slot='button'
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
