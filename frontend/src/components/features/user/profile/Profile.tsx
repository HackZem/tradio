"use client"

import { Icon } from "@iconify-icon/react"
import * as countries from "i18n-iso-countries"
import { useTranslations } from "next-intl"

import { Card, CardContent } from "@/components/ui/common/Card"
import { Block } from "@/components/ui/elements/Block"
import { Heading } from "@/components/ui/elements/Heading"

import { useCurrent } from "@/hooks/useCurrent"

import { ChangeAvatarDialog } from "./dialogs/ChangeAvatarDialog"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

export function Profile() {
	const t = useTranslations("user.profile")

	const { user, isLoadingProfile } = useCurrent()

	return (
		<div className='px-4'>
			<div className='mx-auto max-w-[1285px]'>
				{isLoadingProfile || !user ? (
					"Loading"
				) : (
					<div className='space-y-[50px]'>
						<div className='space-y-6'>
							<Heading size={"xl"} title={t("heading")} />
							<Card>
								<CardContent className='flex justify-between gap-x-[100px]'>
									<div className='flex gap-x-[25px]'>
										<div>
											<ChangeAvatarDialog />
										</div>
										<div className='flex flex-col gap-y-[15px]'>
											<span className='text-[32px] font-bold'>
												{user.username}
											</span>
											<div className='flex items-center gap-x-[10px]'>
												<Icon icon={"entypo:old-phone"} width={25} />
												<span className='text-lg'>{user.phone ?? "phone"}</span>
											</div>
											<div className='flex items-center gap-x-[10px]'>
												<Icon icon={"lsicon:location-filled"} width={26} />
												<span className='text-lg'>
													{`${user.city ?? "city"}, ${countries.getName(user.country ?? "", "en") ?? "country"}`}
												</span>
											</div>
										</div>
									</div>
									<div className='w-full max-w-[800px]'>
										<Heading title={t("description.heading")} size={"lg"} />
										<p className='text-xl'>
											{user.description ?? (
												<span className='text-muted-foreground'>
													{t("description.empty")}
												</span>
											)}
										</p>
									</div>
								</CardContent>
							</Card>
						</div>
						<Block heading={t("lots")}>
							<p>AFFFF</p>
						</Block>
					</div>
				)}
			</div>
		</div>
	)
}
