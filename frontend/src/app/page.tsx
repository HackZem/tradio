"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/common/Button"

export default function Home() {
	const t = useTranslations("home")

	return (
		<div>
			{t("title")}
			<Button>default</Button>
			<Button variant={"outline"}>outline</Button>
			<Button variant={"destructive"}>destructive</Button>
			<Button variant={"secondary"}>secondary</Button>
		</div>
	)
}
