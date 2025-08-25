"use client"

import { getTime, toDate } from "date-fns"
import { useTranslations } from "next-intl"

import { COUNTDOWN_HIGHLIGHT_THRESHOLD } from "@/libs/constants/data.constants"

import { timeStore } from "@/store/time/time.store"

import { getFormattedCountdown } from "@/utils/get-formatted-countdown"
import { cn } from "@/utils/tw-merge"

interface LotTimerProps {
	expiresAt: any
}

export function LotTimer({ expiresAt }: LotTimerProps) {
	const t = useTranslations("lot.card")

	const { now } = timeStore()

	const timeLeft = now && Math.max(getTime(toDate(expiresAt)) - now, 0)

	return (
		<>
			{timeLeft !== 0 ? (
				<span
					className={cn(
						timeLeft &&
							timeLeft <= COUNTDOWN_HIGHLIGHT_THRESHOLD &&
							"text-destructive",
					)}
				>
					{getFormattedCountdown(timeLeft)}
				</span>
			) : (
				<span className='text-destructive'>{t("expired")}</span>
			)}
		</>
	)
}
