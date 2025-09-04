export interface IAuthStore {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
}
