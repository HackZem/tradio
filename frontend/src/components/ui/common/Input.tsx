import { ComponentProps } from "react"

import { cn } from "@/utils/tw-merge"

function Input({ className, type, ...props }: ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot='input'
			placeholder=''
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 hover:bg-input flex h-[2.875rem] w-full min-w-0 rounded-full hover:filter",
				"bg-input px-3 py-1 pl-4 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
				"text-xl disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
				"aria-invalid:ring-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				"[&:not(:placeholder-shown)]:border-ring [&:not(:placeholder-shown)]:bg-transparent [&:not(:placeholder-shown)]:ring-[2px]",
				"focus-visible:border-ring focus-visible:ring-ring! hover:ring-primary hover:brightness-90 focus-visible:bg-transparent focus-visible:ring-[2px] [&:not(:placeholder-shown):not(:focus-visible)]:ring-inset",
				className,
			)}
			{...props}
		/>
	)
}

export { Input }
