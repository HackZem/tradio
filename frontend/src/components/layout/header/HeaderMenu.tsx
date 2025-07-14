"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

import { Button } from "@/components/ui/common/Button"

import { useAuth } from "@/hooks/useAuth"

import { ProfileMenu } from "./ProfileMenu"

export function HeaderMenu() {
	const t = useTranslations("layout.header.menu")

	const { isAuthenticated } = useAuth()

	return (
		<div className='ml-auto flex items-center gap-x-4'>
			{isAuthenticated ? (
				<ProfileMenu />
			) : (
				<>
					<Link href='/account/login'>
						<Button variant='outline' className='w-[118px] rounded-[12px]'>
							{t("login")}
						</Button>
					</Link>
					<Link href='/account/create'>
						<Button className='w-[118px] rounded-[12px]'>
							{t("register")}
						</Button>
					</Link>
				</>
			)}
		</div>
	)
}
