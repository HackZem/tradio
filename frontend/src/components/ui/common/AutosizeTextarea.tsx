"use client"

import {
	forwardRef,
	Ref,
	RefObject,
	TextareaHTMLAttributes,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react"

import { cn } from "@/utils/tw-merge"

interface UseAutosizeTextAreaProps {
	textAreaRef: RefObject<HTMLTextAreaElement | null>
	minHeight?: number
	maxHeight?: number
	triggerAutoSize: string
}

export const useAutosizeTextArea = ({
	textAreaRef,
	triggerAutoSize,
	maxHeight = Number.MAX_SAFE_INTEGER,
	minHeight = 0,
}: UseAutosizeTextAreaProps) => {
	const [init, setInit] = useState(true)
	useEffect(() => {
		// We need to reset the height momentarily to get the correct scrollHeight for the textarea
		const offsetBorder = 6
		const textAreaElement = textAreaRef.current
		if (textAreaElement) {
			if (init) {
				textAreaElement.style.minHeight = `${minHeight + offsetBorder}px`
				if (maxHeight > minHeight) {
					textAreaElement.style.maxHeight = `${maxHeight}px`
				}
				setInit(false)
			}
			textAreaElement.style.height = `${minHeight + offsetBorder}px`
			const scrollHeight = textAreaElement.scrollHeight
			// We then set the height directly, outside of the render loop
			// Trying to set this with state or a ref will product an incorrect value.
			if (scrollHeight > maxHeight) {
				textAreaElement.style.height = `${maxHeight}px`
			} else {
				textAreaElement.style.height = `${scrollHeight + offsetBorder}px`
			}
		}
	}, [textAreaRef.current, triggerAutoSize])
}

export type AutosizeTextAreaRef = {
	textArea: HTMLTextAreaElement
	maxHeight: number
	minHeight: number
}

type AutosizeTextAreaProps = {
	maxHeight?: number
	minHeight?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export const AutosizeTextarea = forwardRef<
	AutosizeTextAreaRef,
	AutosizeTextAreaProps
>(
	(
		{
			maxHeight = Number.MAX_SAFE_INTEGER,
			minHeight = 52,
			className,
			onChange,
			value,
			...props
		}: AutosizeTextAreaProps,
		ref: Ref<AutosizeTextAreaRef>,
	) => {
		const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
		const [triggerAutoSize, setTriggerAutoSize] = useState("")

		useAutosizeTextArea({
			textAreaRef,
			triggerAutoSize: triggerAutoSize,
			maxHeight,
			minHeight,
		})

		useImperativeHandle(ref, () => ({
			textArea: textAreaRef.current as HTMLTextAreaElement,
			focus: () => textAreaRef?.current?.focus(),
			maxHeight,
			minHeight,
		}))

		useEffect(() => {
			setTriggerAutoSize(value as string)
		}, [props?.defaultValue, value])

		return (
			<textarea
				{...props}
				value={value}
				ref={textAreaRef}
				className={cn(
					"border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-xl focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				onChange={e => {
					setTriggerAutoSize(e.target.value)
					onChange?.(e)
				}}
			/>
		)
	},
)
AutosizeTextarea.displayName = "AutosizeTextarea"
