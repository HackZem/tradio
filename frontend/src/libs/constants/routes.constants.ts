export const ROUTES = {
	HOME: "/",
	NEWS: "/news",
	TOP_USERS: "/top-users",
	HELP: "/help",
	CONTACT: "/contact",
	ABOUT: "/about",
	LOTS: "/lots",
	LOGIN: "/account/login",
	REGISTER: "/account/create",
	LOTS_DETAIL: (id: string) => `/lots/${id}`,
	LOTS_EDIT: (id: string) => `/lots/${id}/edit`,
	PROFILE: (username: string) => `/users/${username}`,
} as const
