"use client"

import { UserAvatar } from "@/components/ui/elements/UserAvatar"

import { useCurrent } from "@/hooks/useCurrent"

export default function Home() {
	const { user, isLoadingProfile } = useCurrent()

	return (
		<div>
			{isLoadingProfile ? <span>Loading...</span> : <>{JSON.stringify(user)}</>}
		</div>
	)
}
