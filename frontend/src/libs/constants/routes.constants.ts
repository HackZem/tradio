export const ROUTES = {
	HOME: "/",
	NEWS: "/news",
	TOP_USERS: "/top-users",
	HELP: "/help",
	CONTACT: "/contact",
	ABOUT: "/about",
	LOTS: "/lots",
	LOTS_DETAIL: (id: string) => `/lots/${id}`,
	PROFILE: (username: string) => `/users/${username}`,
} as const
