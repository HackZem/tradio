export interface ITimeStore {
	now: number | undefined
	start: (interval: number) => void
	stop: () => void
}
