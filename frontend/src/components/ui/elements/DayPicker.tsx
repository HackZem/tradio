"use client"

import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/utils/tw-merge"

import { Button } from "../common/Button"
import { Calendar } from "../common/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"

interface DayPickerProps {
	date: Date
	onValueChange: (date: Date) => void
	className?: string
}

export function DayPicker({ onValueChange, date, className }: DayPickerProps) {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<div className='flex flex-col gap-3'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						id='date'
						className={cn(
							`text-foreground border-border h-[45px] w-full justify-between
							px-3 font-normal hover:border-transparent`,
							className,
						)}
					>
						{date ? date.toLocaleDateString() : ""}
						<ChevronDownIcon className='ml-auto size-5 stroke-3 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto overflow-hidden p-0' align='start'>
					<Calendar
						mode='single'
						required={true}
						selected={date}
						captionLayout='dropdown'
						onSelect={selected => {
							onValueChange(selected)
							setOpen(false)
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
