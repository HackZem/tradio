"use client"

import { Icon } from "@iconify-icon/react"
import { State } from "country-state-city"
import * as countries from "i18n-iso-countries"
import _ from "lodash"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/common/Card"
import { Skeleton } from "@/components/ui/common/Skeleton"
import { FullTextTooltip } from "@/components/ui/elements/FullTextTooltip"
import { Heading } from "@/components/ui/elements/Heading"
import { UserAvatar } from "@/components/ui/elements/UserAvatar"

import { FindAllLotsQuery, LotType } from "@/graphql/generated/output"

import { getMediaSource } from "@/utils/get-media-source"
import { cn } from "@/utils/tw-merge"

import { LotTimer } from "./LotTimer"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

interface LotCardProps {
	lot: FindAllLotsQuery["findAllLots"]["lots"][number]
	currentUserUsername: string
	className?: string
}

export function LotCard({ lot, currentUserUsername, className }: LotCardProps) {
	const t = useTranslations("lot.card")
	const tEnum = useTranslations("enums.lotTypes")

	return (
		<Card
			className={cn("h-[500px] justify-between gap-0 truncate p-0", className)}
		>
			{lot.photos[0] ? (
				<Image
					src={getMediaSource(lot.photos[0])}
					alt={lot.title}
					width={0}
					height={0}
					sizes='100vw'
					style={{ width: "auto", height: "100%" }}
					className='bg-muted flex items-center justify-center object-cover'
				/>
			) : (
				<div className='bg-muted flex h-full items-center justify-center'>
					<Icon icon={"f7:question"} width={100} />
				</div>
			)}

			<div className='p-2 pt-1'>
				<FullTextTooltip text={lot.title}>
					<Heading
						size={"sm"}
						title={lot.title}
						className='line-clamp-2 break-all whitespace-break-spaces'
					/>
				</FullTextTooltip>

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
						<span className='line-clamp-1 break-all whitespace-break-spaces'>
							{`${State.getStateByCodeAndCountry(lot.region, lot.country)?.name}, ${countries.getName(lot.country, "en")}`}
						</span>
					</div>
				</div>
				<div className='mt-2 flex items-center justify-between'>
					{/* TODO: remove this wrinkle with me */}
					<Link
						href={`/users/${lot.user.username === currentUserUsername ? "me" : lot.user.username}`}
					>
						<div className='flex items-center gap-x-2'>
							<UserAvatar user={lot.user} size={"sm"} />
							<span>{lot.user.username}</span>
						</div>
					</Link>
					<LotTimer expiresAt={lot.expiresAt} />
				</div>
			</div>
		</Card>
	)
}

export function LotCardSkeleton() {
	return (
		<div
			className='flex h-[500px] flex-col gap-y-2.5 overflow-hidden
				rounded-[25px]'
		>
			<Skeleton className='h-1/2' />
			{_.times(5, i => (
				<Skeleton className='flex-1' key={i} />
			))}
			<div className='flex h-full flex-[2] gap-x-2.5'>
				<Skeleton className='aspect-square h-full' />
				<Skeleton className='h-full w-full' />
			</div>
		</div>
	)
}
