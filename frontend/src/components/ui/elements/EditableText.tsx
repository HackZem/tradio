"use client"

import {
	useState,
	useRef,
	useEffect,
	type KeyboardEvent,
	ChangeEvent,
} from "react"

import { MAX_DESCRIPTION_LENGTH } from "@/libs/constants/data.constants"

import {
	AutosizeTextarea,
	type AutosizeTextAreaRef,
} from "../common/AutosizeTextarea"

type EditableTextProps = {
	value: string
	onChange: (value: string) => void
	onPreviewChange?: (value: string) => void
	placeholder?: string
	className?: string
}

export default function EditableText({
	value,
	onChange,
	onPreviewChange,
	placeholder = "Editing...",
	className,
}: EditableTextProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [currentValue, setCurrentValue] = useState(value)
	const textareaRef = useRef<AutosizeTextAreaRef>(null)

	useEffect(() => {
		setCurrentValue(value)
	}, [value])

	useEffect(() => {
		if (isEditing && textareaRef.current && textareaRef.current.textArea) {
			textareaRef.current.textArea.focus()
		}
	}, [isEditing])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				isEditing &&
				textareaRef.current &&
				textareaRef.current.textArea &&
				!textareaRef.current.textArea.contains(event.target as Node)
			) {
				setIsEditing(false)
				onChange(currentValue)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [isEditing, currentValue, onChange])

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			setIsEditing(false)
			onChange(currentValue)
		}
	}

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		if (newValue.length <= MAX_DESCRIPTION_LENGTH) {
			setCurrentValue(e.target.value)

			onPreviewChange?.(newValue)
		}
	}

	return (
		<div className={className}>
			{isEditing ? (
				<AutosizeTextarea
					ref={textareaRef}
					value={currentValue}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className='min-w-[200px] resize-none overflow-hidden rounded border'
				/>
			) : (
				<div
					onClick={() => setIsEditing(true)}
					className='cursor-pointer rounded break-words whitespace-pre-wrap hover:bg-gray-100'
				>
					{value || (
						<span className='text-muted-foreground'>{placeholder}</span>
					)}
				</div>
			)}
		</div>
	)
}
