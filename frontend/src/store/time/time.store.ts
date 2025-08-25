import { create } from "zustand"

import { TimeStore } from "./time.types"

export const timeStore = create<TimeStore>((set, _) => {
	let timerId: number | null = null

	return {
		now: undefined,
		start: interval => {
			if (typeof window === "undefined") return
			if (timerId !== null) return

			timerId = window.setInterval(() => {
				set({ now: Date.now() })
			}, interval)
		},
		stop: () => {
			if (timerId !== null) {
				clearInterval(timerId)
				timerId = null
			}
		},
	}
})
