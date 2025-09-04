import { create } from "zustand"

import { ITimeStore } from "./time.types"

export const timeStore = create<ITimeStore>((set, _) => {
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
