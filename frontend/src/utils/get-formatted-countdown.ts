import { intervalToDuration } from "date-fns"

//TODO: bug with date formatting -> 7:00 to 6:23:59:59
export function getFormattedCountdown(ms?: number): string {
	if (!ms) return "--:--"

	const { seconds, minutes, hours, days } = intervalToDuration({
		start: 0,
		end: ms,
	})

	const zeroPad = (num: number) => String(num).padStart(2, "0")

	const parts: string[] = [
		...(days ? [zeroPad(days)] : []),
		...(hours ? [zeroPad(hours)] : []),
		...(minutes ? [zeroPad(minutes)] : []),
		zeroPad(seconds ?? 0),
	]

	return parts.join(":")
}
