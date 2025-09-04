"use client"

import { CheckedState } from "@radix-ui/react-checkbox"
import { useRef } from "react"

import { Checkbox } from "../../common/Checkbox"

interface FilterCheckboxProps {
	title: string
	isChecked?: boolean
	onCheckedChange?: (checked: CheckedState) => void
}

export function FilterCheckbox({
	title,
	isChecked = false,
	onCheckedChange,
}: FilterCheckboxProps) {
	const checkboxRef = useRef<HTMLButtonElement>(null)

	return (
		<label className='flex cursor-pointer items-center gap-x-2.5'>
			<Checkbox
				className='cursor-pointer'
				checked={isChecked}
				onCheckedChange={onCheckedChange}
				ref={checkboxRef}
				id={title}
			/>
			<span>{title}</span>
		</label>
	)
}
