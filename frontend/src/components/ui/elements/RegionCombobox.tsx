"use client"

import { State } from "country-state-city"
import { Alpha2Code } from "i18n-iso-countries"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"

import { cn } from "@/utils/tw-merge"

import { Button } from "../common/Button"
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../common/Command"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { ScrollArea } from "../common/ScrollArea"

interface RegionOption {
	label: string
	value: string
}

interface RegionComboboxProps {
	country: Alpha2Code
	value?: string
	onValueChange?: (value: string) => void
	disabled: boolean
}

export function RegionCombobox({
	country,
	value,
	onValueChange,
	disabled,
}: RegionComboboxProps) {
	const [open, setOpen] = useState(false)

	const options: RegionOption[] = State.getStatesOfCountry(country).map(
		({ name, isoCode }) => {
			return { label: name, value: isoCode }
		},
	)

	const selectedOption = options.find(option => option.value === value)

	return (
		<Popover open={open} onOpenChange={setOpen} modal>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
					disabled={disabled}
				>
					{selectedOption ? selectedOption.label : "Choose region..."}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0' align='start'>
				<Command>
					<CommandInput
						placeholder={"Search region..."}
						className='text-[16px]'
					/>
					<CommandList>
						<ScrollArea className='h-72'>
							<CommandEmpty>{"empty"}</CommandEmpty>
							<CommandGroup>
								{options.map(option => (
									<CommandItem
										className='group text-lg'
										key={option.value}
										value={option.label}
										onSelect={() => {
											onValueChange?.(option.value)
											setOpen(false)
										}}
									>
										<Check
											className={cn(
												"group-data-[selected=true]:text-primary-foreground mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
