"use client"

import { Icon } from "@iconify-icon/react"

interface ChipProps {
	title: string
	onDelete?: () => void
}

export function Chip({ title, onDelete }: ChipProps) {
	return (
		<div
			className='rounded-full bg-input flex gap-x-[5px] py-1 px-2 items-center
				cursor-pointer group'
			onClick={onDelete}
		>
			<span className='text-sm'>{title}</span>
			<Icon
				icon='lets-icons:close-round'
				width={20}
				className='group-hover:text-destructive'
			/>
		</div>
	)
}
