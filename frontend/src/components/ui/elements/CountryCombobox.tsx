"use client"

import * as countries from "i18n-iso-countries"
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

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

interface CountryOption {
	label: string
	value: string
}

interface CountryComboboxProps {
	value?: string
	onValueChange?: (value: string) => void
	disabled?: boolean
	className?: string
}

export function CountryCombobox({
	value,
	onValueChange,
	disabled = false,
	className,
}: CountryComboboxProps) {
	const [open, setOpen] = useState(false)

	const options: CountryOption[] = Object.entries(countries.getNames("en")).map(
		([countryShortCode, countryName]) => ({
			label: countryName as string,
			value: countryShortCode,
		}),
	)

	const selectedOption = options.find(option => option.value === value)

	return (
		<Popover open={open} onOpenChange={setOpen} modal={true}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className={cn("w-full justify-between rounded-[12px]", className)}
					disabled={disabled}
				>
					{selectedOption ? selectedOption.label : "Choose country..."}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0' align='start'>
				<Command>
					<CommandInput
						placeholder={"Search country..."}
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
												`group-data-[selected=true]:text-primary-foreground mr-2
												h-4 w-4`,
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
