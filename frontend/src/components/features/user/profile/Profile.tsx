"use client"

import { Icon } from "@iconify-icon/react"
import { State } from "country-state-city"
import * as countries from "i18n-iso-countries"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/common/Card"
import { ConfirmDialog } from "@/components/ui/elements/ConfirmDialog"
import { Heading } from "@/components/ui/elements/Heading"
import { UserAvatar } from "@/components/ui/elements/UserAvatar"

import {
	FindAllLotsQuery,
	FindProfileQuery,
	useRemoveProfileAvatarMutation,
} from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { UserDescription } from "./UserDescription"
import { UserLots } from "./UserLots"
import { ChangeAvatarDialog } from "./dialogs/ChangeAvatarDialog"
import { ChangeLocationDialog } from "./dialogs/ChangeLocationDialog"
import { ChangePhoneDialog } from "./dialogs/ChangePhoneDialog"
import { ChangeUsernameDialog } from "./dialogs/ChangeUsernameDialog"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

interface ProfileProps {
	initialProfile: FindProfileQuery["findProfile"]
	lots: FindAllLotsQuery["findAllLots"]["lots"]
}

export function Profile({ initialProfile, lots }: ProfileProps) {
	const t = useTranslations("user.profile")

	const { user, refetch } = useCurrent()

	const isMe = user?.username === initialProfile.username

	const profile = isMe ? user : initialProfile

	const [remove] = useRemoveProfileAvatarMutation({
		onCompleted() {
			refetch()
			toast.success(t("avatar.successRemovedMessage"))
		},
		onError() {
			toast.error(t("avatar.errorRemovedMessage"))
		},
	})

	return (
		<div className='mb-20 px-4'>
			<div className='mx-auto max-w-[1285px]'>
				{!profile ? (
					"Loading"
				) : (
					<div className='space-y-[50px]'>
						<div className='space-y-6'>
							<Heading size={"xl"} title={t("heading")} />
							<Card>
								<CardContent className='flex justify-between gap-x-[10px]'>
									<div className='flex gap-x-[25px]'>
										<div className='group relative h-min'>
											<UserAvatar
												size={"lg"}
												user={profile!}
												className={
													isMe
														? "transition-opacity group-hover:opacity-20"
														: ""
												}
											/>
											<div
												className='absolute top-1/2 left-1/2 hidden
													-translate-x-1/2 -translate-y-1/2 transform
													items-center justify-center gap-3 group-hover:flex'
											>
												{isMe && (
													<ChangeAvatarDialog>
														<Icon
															icon={"bx:pencil"}
															width={35}
															alt='change avatar'
															className='hover:text-primary'
														/>
													</ChangeAvatarDialog>
												)}
												{profile.avatar && isMe && (
													<ConfirmDialog
														heading={t("avatar.confirmDialog.heading")}
														message={t("avatar.confirmDialog.message")}
														onConfirm={() => remove()}
													>
														<Icon
															icon={"material-symbols:delete-outline-rounded"}
															width={35}
															alt='delete avatar'
															className='hover:text-destructive'
														/>
													</ConfirmDialog>
												)}
											</div>
										</div>
										<div className='flex flex-col gap-y-[15px]'>
											<div className='flex items-center'>
												<span
													className='max-w-[400px] text-[32px] font-bold
														wrap-break-word'
												>
													{isMe ? user.username : profile.username}
												</span>
												{isMe && (
													<ChangeUsernameDialog>
														<Icon
															icon='bx:pencil'
															width={25}
															className='hover:text-primary ml-2'
															alt='change username'
														/>
													</ChangeUsernameDialog>
												)}
											</div>
											<div className='flex items-center gap-x-[10px]'>
												<Icon icon={"entypo:old-phone"} width={25} />
												<div className='flex items-center'>
													<span className='text-lg'>
														{profile.phone ?? "undefined"}
													</span>
													{isMe && (
														<ChangePhoneDialog>
															<Icon
																icon='bx:pencil'
																width={25}
																className='hover:text-primary ml-2'
																alt='change phone'
															/>
														</ChangePhoneDialog>
													)}
												</div>
											</div>
											<div className='flex items-center gap-x-[10px]'>
												<Icon icon={"lsicon:location-filled"} width={26} />
												<div className='flex items-center'>
													<span className='text-lg'>
														{profile.country && profile.region
															? `${State.getStateByCodeAndCountry(profile.region, profile.country)?.name}, ${countries.getName(profile.country, "en")}`
															: "undefined"}
													</span>
													{isMe && (
														<ChangeLocationDialog>
															<Icon
																icon='bx:pencil'
																width={25}
																className='hover:text-primary ml-2'
																alt='change country and region'
															/>
														</ChangeLocationDialog>
													)}
												</div>
											</div>
										</div>
									</div>
									<div className='w-full max-w-[700px]'>
										{isMe ? (
											<UserDescription />
										) : (
											<div
												className='rounded text-xl break-words
													whitespace-pre-wrap'
											>
												{profile.description}
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</div>
						<UserLots initialLots={lots} username={profile.username} />
					</div>
				)}
			</div>
		</div>
	)
}
