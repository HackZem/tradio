import { useEffect } from "react"

import {
	useClearSessionCookieMutation,
	useFindMeQuery,
} from "@/graphql/generated/output"

import { useAuth } from "./useAuth"

export function useCurrent() {
	const { isAuthenticated, exit } = useAuth()

	const { data, loading, refetch, error } = useFindMeQuery({
		skip: !isAuthenticated,
	})

	const [clear] = useClearSessionCookieMutation()

	useEffect(() => {
		if (error) {
			if (isAuthenticated) {
				clear()
			}
			exit()
		}
	}, [isAuthenticated, exit, clear])

	return {
		user: data?.findMe,
		isLoadingProfile: loading,
		refetch,
	}
}
