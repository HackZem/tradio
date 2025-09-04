import { intervalToDuration } from "date-fns"

export function getFormattedCountdown(ms?: number): string {
	if (!ms) return "--:--"

	const {
		seconds = 0,
		minutes = 0,
		hours = 0,
		days = 0,
	} = intervalToDuration({
		start: 0,
		end: ms,
	})

	const zeroPad = (num: number) => String(num).padStart(2, "0")

	const parts = [days, hours, minutes, seconds].map(zeroPad)

	const firstNonZero = parts.findIndex(p => p !== "00")

	const startIndex = firstNonZero === -1 ? parts.length - 1 : firstNonZero

	return parts.slice(startIndex).join(":")
}
