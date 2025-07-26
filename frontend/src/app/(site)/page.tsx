"use client"

import { useCurrent } from "@/hooks/useCurrent"

export default function Home() {
	const { user, isLoadingProfile } = useCurrent()

	return (
		<div>
			{isLoadingProfile ? <span>Loading...</span> : <>{JSON.stringify(user)}</>}
		</div>
	)
}
