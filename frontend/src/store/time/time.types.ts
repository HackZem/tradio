export interface TimeStore {
	now: number | undefined
	start: () => void
	stop: () => void
}
