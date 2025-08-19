"use client"

import { Icon } from "@iconify-icon/react"
import { State } from "country-state-city"
import * as countries from "i18n-iso-countries"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { Card } from "@/components/ui/common/Card"
import { Heading } from "@/components/ui/elements/Heading"
import { UserAvatar } from "@/components/ui/elements/UserAvatar"

import { FindAllLotsQuery, LotType } from "@/graphql/generated/output"

import { useDateCountdown } from "@/hooks/useDateCountdown"

import { COUNTDOWN_HIGHLIGHT_THRESHOLD } from "@/libs/constants/data.constants"

import { getFormattedCountdown } from "@/utils/get-formatted-countdown"
import { getMediaSource } from "@/utils/get-media-source"
import { cn } from "@/utils/tw-merge"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

interface LotCardProps {
	lot: FindAllLotsQuery["findAllLots"][number]
}

export function LotCard({ lot }: LotCardProps) {
	const t = useTranslations("lot.card")
	const tEnum = useTranslations("enums.lotTypes")

	const { isEnded, countdown: timeLeft } = useDateCountdown(lot.expiresAt)

	return (
		<Card className='h-[500px] justify-between gap-0 truncate p-0'>
			<Image
				src={getMediaSource(lot.photos[0])}
				alt={lot.title}
				width={0}
				height={0}
				sizes='100vw'
				style={{ width: "auto", height: "100%" }}
				className='bg-muted flex items-center justify-center object-cover'
			/>

			<div className='p-2 pt-1'>
				<Heading
					size={"sm"}
					title={lot.title}
					className='line-clamp-2 break-all whitespace-break-spaces'
				/>
				<div className='flex items-center justify-between'>
					<span className='text-2xl font-bold'>{lot.currentPrice}€</span>
					<span>{tEnum(lot.type)}</span>
				</div>
				<div className='flex items-center justify-between'>
					<span className='text-muted-foreground'>
						{lot.firstPrice}€ {t("firstPrice")}
					</span>
					<span className='text-muted-foreground'>
						{lot.type !== LotType.Auction &&
							`${lot.buyNowPrice}€ ${t("buyNow")}`}
					</span>
				</div>
				<div className='text-muted-foreground flex items-center gap-x-[7px]'>
					<Icon icon={"ic:round-gavel"} width={20} />
					<span>{lot._count.bids}</span>
				</div>
				<div className='text-muted-foreground flex items-center gap-x-[7px]'>
					<Icon icon={"lsicon:location-filled"} width={20} />
					<div className='flex items-center'>
						<span>
							{`${State.getStateByCodeAndCountry(lot.region, lot.country)?.name}, ${countries.getName(lot.country, "en")}`}
						</span>
					</div>
				</div>
				<div className='mt-2 flex items-center justify-between'>
					<div className='flex items-center gap-x-2'>
						<UserAvatar user={lot.user} size={"sm"} />
						<span>{lot.user.username}</span>
					</div>
					{isEnded ? (
						<span className='text-destructive'>{t("expired")}</span>
					) : (
						<span
							className={cn(
								timeLeft &&
									timeLeft <= COUNTDOWN_HIGHLIGHT_THRESHOLD &&
									"text-destructive",
							)}
						>
							{getFormattedCountdown(timeLeft)}
						</span>
					)}
				</div>
			</div>
		</Card>
	)
}
