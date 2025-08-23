import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Profile } from "@/components/features/user/profile/Profile"

import {
	FindProfileDocument,
	FindProfileQuery,
} from "@/graphql/generated/output"

import { SERVER_URL } from "@/libs/constants/url.constants"

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("user.profile")

	return {
		title: t("heading"),
	}
}

async function findProfile(username: string) {
	try {
		const query = FindProfileDocument.loc?.source.body

		const response = await fetch(SERVER_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				query,
				variables: {
					username,
				},
			}),
			next: {
				revalidate: 30,
			},
		})

		const data = await response.json()

		return {
			profile: data.data.findProfile as FindProfileQuery["findProfile"],
		}
	} catch (err) {
		console.error(err)
		throw new Error("Error when receiving profile")
	}
}

export default async function ProfilePage({
	params,
}: Readonly<{
	params: Promise<{ username: string }>
}>) {
	const { username } = await params

	const { profile } = await findProfile(username)

	return (
		<div>
			<Profile profile={profile} />
		</div>
	)
}
