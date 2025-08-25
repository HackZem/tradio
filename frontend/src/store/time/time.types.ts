export interface TimeStore {
	now: number | undefined
	start: (interval: number) => void
	stop: () => void
}
