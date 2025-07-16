"use client"

import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"

import { AuthWrapper } from "../AuthWrapper"

export function ChackEmailForm() {
	const t = useTranslations("auth.verify")

	return (
		<AuthWrapper heading={t("heading")}>
			<div className='flex flex-row items-center justify-center gap-5 px-5'>
				<Icon icon='garden:email-stroke-16' width='5rem'></Icon>
				<p className='text-wrap'>{t("description")}</p>
			</div>
		</AuthWrapper>
	)
}
