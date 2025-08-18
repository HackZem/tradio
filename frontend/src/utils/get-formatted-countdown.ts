import { intervalToDuration } from "date-fns"

export function getFormattedCountdown(ms: number | null): string {
	if (!ms) return ""

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
