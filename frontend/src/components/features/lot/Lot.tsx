"use client"

import { Icon } from "@iconify-icon/react"
import { State } from "country-state-city"
import { format } from "date-fns"
import * as countries from "i18n-iso-countries"
import _ from "lodash"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/common/Button"
import { Heading } from "@/components/ui/elements/Heading"
import { UserAvatar } from "@/components/ui/elements/UserAvatar"

import {
	FindLotByIdQuery,
	LotType,
	useSubscribeToLotMutation,
	useUnsubscribeFromLotMutation,
} from "@/graphql/generated/output"

import { useAuth } from "@/hooks/useAuth"

import { ROUTES } from "@/libs/constants/routes.constants"

import { LotDescription } from "./LotDescription"
import { LotPhotosPreview } from "./LotPhotosPreview"
import { LotTimer } from "./card/LotTimer"

countries.registerLocale(require("i18n-iso-countries/langs/en.json"))

interface LotProps {
	lot: FindLotByIdQuery["findLotById"]
}

export function Lot({ lot }: LotProps) {
	const t = useTranslations("lot")
	const tEnums = useTranslations("enums")

	const { isAuthenticated } = useAuth()

	const router = useRouter()

	const {
		photos,
		title,
		currentPrice,
		firstPrice,
		buyNowPrice,
		views,
		expiresAt,
		condition,
		type,
		returnPeriod,
		isActive,
		id,
		isSubscribed,
		user,
		_count: { bids: bidsCount },
	} = lot

	const [isLotSubscribed, setIsLotSubscribed] = useState<boolean>(isSubscribed)

	useEffect(() => setIsLotSubscribed(isSubscribed), [isSubscribed])

	const [subscribe, { loading: isSubscribing }] = useSubscribeToLotMutation({
		variables: { lotId: id },
		onCompleted() {
			setIsLotSubscribed(true)
			toast.success(t("successSubscribeToLot"))
		},
		onError() {
			setIsLotSubscribed(false)
			toast.error(t("errorSubscribeToLot"))
		},
	})

	const [unsubscribe, { loading: isUnsubscribing }] =
		useUnsubscribeFromLotMutation({
			variables: { lotId: id },
			onCompleted() {
				setIsLotSubscribed(false)
				toast.success(t("successUnsubscribeFromLot"))
			},
			onError() {
				setIsLotSubscribed(true)
				toast.error(t("errorUnsubscribeFromLot"))
			},
		})

	return (
		<div>
			<div className='flex w-full gap-x-5'>
				<LotPhotosPreview photos={photos} />
				<div className='w-full max-w-[500px] space-y-[20px]'>
					<Heading
						title={title}
						size={"lg"}
						className='break-all whitespace-break-spaces'
					/>
					<div className='space-y-3'>
						<div className='flex items-center justify-between'>
							<div className='-mb-2 flex items-center gap-x-4'>
								<span className='text-[32px] leading-[1] font-bold'>
									{currentPrice}€
								</span>
								{buyNowPrice && (
									<span className='text-muted-foreground text-2xl'>
										{`${t("buyNow")} ${buyNowPrice}€`}
									</span>
								)}
							</div>
							<div
								className='text-muted-foreground flex items-center gap-x-[5px]'
							>
								<Icon icon={"mdi:eye"} width={25} />
								<span className='text-2xl'>{views}</span>
							</div>
						</div>
						<span className='text-muted-foreground text-xl'>{`${firstPrice}€ ${t("firstPrice")}`}</span>
						<div className='text-muted-foreground flex items-center gap-x-[7px]'>
							<Icon icon={"ic:round-gavel"} width={20} />
							<span className='text-xl'>{`${bidsCount} ${t("bids")}`}</span>
						</div>
					</div>
					{type !== "BUYNOW" && (
						<div className='flex items-center gap-x-2'>
							<Icon icon={"lets-icons:clock"} width={35} />
							<span className='text-2xl font-bold'>
								<LotTimer expiresAt={expiresAt} /> {" · "}
								{format(expiresAt, "dd EEEE p")}
							</span>
						</div>
					)}
					<div className='space-y-3'>
						<span className='block text-2xl font-bold'>
							{t("condition")}
							{": "}
							<span className='font-normal'>
								{tEnums(`conditionTypes.${condition}`)}
							</span>
						</span>

						<span className='block text-2xl font-bold'>
							{t("returns")}
							{": "}
							<span className='font-normal'>
								{tEnums(`returnTypes.${returnPeriod}`)}
							</span>
						</span>

						<span className='block text-2xl font-bold'>
							{t("location")}
							{": "}
							<span className='font-normal'>
								{`${State.getStateByCodeAndCountry(lot.region, lot.country)?.name}, ${countries.getName(lot.country, "en")}`}
							</span>
						</span>
					</div>

					<div
						className='w-full max-w-[370px] space-y-2.5
							[&_button]:rounded-[15px]'
					>
						<div className='flex w-full gap-x-2.5'>
							{type !== "BUYNOW" && (
								<Button className='flex-1' disabled={!isActive}>
									{t("placeBidButton")}
								</Button>
							)}
							{type !== LotType.Auction && (
								<Button className='flex-1' variant={"secondary"}>
									{t("buyNowButton")}
								</Button>
							)}
						</div>
						{type !== LotType.Auction && (
							<Button variant={"outline"} className='w-full'>
								{t("addToCartButton")}
							</Button>
						)}
						{isLotSubscribed ? (
							<Button
								variant={"destructiveOutline"}
								className='w-full'
								disabled={isUnsubscribing || isSubscribing}
								onClick={() => {
									unsubscribe()
									setIsLotSubscribed(false)
								}}
							>
								{t("removeFromWatchlistButton")}
							</Button>
						) : (
							<Button
								variant={"outline"}
								className='w-full'
								disabled={isSubscribing || isUnsubscribing}
								onClick={() => {
									if (isAuthenticated) {
										subscribe()
										setIsLotSubscribed(true)
									} else {
										router.push(ROUTES.LOGIN)
									}
								}}
							>
								{t("addToWatchlistButton")}
							</Button>
						)}
					</div>
					<Link href={`/users/${user.username}`}>
						<div className='flex items-center gap-x-2.5'>
							<UserAvatar user={user} />
							<span className='text-xl'>{user.username}</span>
						</div>
					</Link>
				</div>
			</div>
			<LotDescription description={lot.description} />
		</div>
	)
}
