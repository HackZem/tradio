"use client"

import { useCurrent } from "@/hooks/useCurrent"

import { Profile } from "./Profile"

export function MyProfile() {
	const { user, refetch } = useCurrent()

	return !!user && <Profile profile={user} refetch={refetch} isMe />
}
