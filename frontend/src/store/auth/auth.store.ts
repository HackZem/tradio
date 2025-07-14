import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { AuthStore } from "./auth.types"

export const authStore = create(
	persist<AuthStore>(
		set => ({
			isAuthenticated: false,
			setIsAuthenticated: (vaulue: boolean) => set({ isAuthenticated: vaulue }),
		}),
		{ name: "auth", storage: createJSONStorage(() => localStorage) },
	),
)
