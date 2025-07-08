"use client"

import { useTranslations } from "next-intl"

import { CreateAccountForm } from "@/components/auth/forms/CreateAccountForm"

export default function Home() {
	const t = useTranslations("home")

	return (
		<div className='flex h-full items-center justify-center'>
			<CreateAccountForm />
		</div>
	)
}
