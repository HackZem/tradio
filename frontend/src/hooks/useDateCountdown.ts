import { differenceInMilliseconds, isBefore } from "date-fns"
import { useEffect, useState } from "react"

export function useDateCountdown(endDate: number | string | Date) {
	const end = new Date(endDate)

	const [isEnded, setIsEnded] = useState<boolean>(false)
	const [countdown, setCountdown] = useState<number | null>(null)

	useEffect(() => {
		let interval: NodeJS.Timeout

		const tick = () => {
			const now = new Date()
			const difference = differenceInMilliseconds(end, now)

			if (isBefore(end, now)) {
				setIsEnded(true)
				setCountdown(0)
				clearInterval(interval)
			} else {
				setCountdown(difference)
			}
		}

		tick()

		interval = setInterval(tick, 1000)

		return () => clearInterval(interval)
	}, [endDate])
	return {
		countdown,
		isEnded,
	}
}
