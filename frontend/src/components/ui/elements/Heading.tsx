import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/utils/tw-merge"

const headingSizes = cva("", {
	variants: {
		size: {
			sm: "text-[18px]",
			default: "text-[20px]",
			lg: "text-[24px]",
			xl: "text-[32px]",
		},
	},
	defaultVariants: {
		size: "default",
	},
})

interface HeadingProps extends VariantProps<typeof headingSizes> {
	title: string
}

export function Heading({ size, title }: HeadingProps) {
	return (
		<h1 className={cn("text-foreground font-bold", headingSizes({ size }))}>
			{title}
		</h1>
	)
}
