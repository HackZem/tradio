"use client"

import { Root } from "@radix-ui/react-select"
import { useTranslations } from "next-intl"
import { ComponentProps } from "react"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/common/Select"

interface FilterSelectProps {
	title: string
	elements: { title: string; slug: string }[]
	isEmptyable?: boolean
}

export function FilterSelect({
	title,
	elements,
	isEmptyable = true,
	...props
}: FilterSelectProps & ComponentProps<typeof Root>) {
	const t = useTranslations("elements.filterSelect")

	return (
		<div className='flex items-center justify-between gap-x-1'>
			<span>{title}</span>
			<Select defaultValue={"empty"} {...props}>
				<SelectTrigger className='h-[35px] w-full max-w-[170px]'>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{isEmptyable && <SelectItem value='empty'>{t("empty")}</SelectItem>}
					{elements.map(element => (
						<SelectItem value={element.slug} key={element.slug}>
							{element.title}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
