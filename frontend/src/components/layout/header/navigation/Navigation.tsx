"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/common/Button"

import { cn } from "@/utils/tw-merge"

import { Route } from "./route.interface"

export function Navigation() {
	const t = useTranslations("layout.header.navigation")

	const pathname = usePathname()

	const routes: Route[] = [
		{ label: t("lots"), href: "/lots" },
		{ label: t("news"), href: "/news" },
		{ label: t("topUsers"), href: "/top-users" },
		{ label: t("help"), href: "/help" },
		{ label: t("contact"), href: "/contact" },
		{ label: t("about"), href: "/about" },
	]

	return (
		<nav className='ml-[130px] flex gap-x-[45px]'>
			{routes.map(route => (
				<Link href={route.href} key={route.label}>
					<Button
						variant={"ghost"}
						className={cn("text-lg", route.href === pathname && "text-primary")}
					>
						{route.label}
					</Button>
				</Link>
			))}
		</nav>
	)
}
