"use client"

import { useEffect } from "react"

import { timeStore } from "@/store/time/time.store"

export function TimerStarter() {
	const { start, stop } = timeStore()

	useEffect(() => {
		start()

		return () => {
			stop()
		}
	}, [])
	return null
}
