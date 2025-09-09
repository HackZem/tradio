"use client"

import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"

import { Heading } from "./Heading"

export function EmptyState() {
	const t = useTranslations("elements.emptyState")

	return (
		<div className='flex w-full flex-col items-center justify-center'>
			<Icon
				icon='hugeicons:search-remove'
				width={100}
				className='text-muted-foreground'
			/>
			<Heading title={t("heading")} size={"xl"} />
		</div>
	)
}
