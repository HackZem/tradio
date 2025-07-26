import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Profile } from "@/components/features/user/profile/Profile"

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("user.profile")

	return {
		title: t("heading"),
	}
}

export default function ProfilePage() {
	return (
		<div>
			<Profile />
		</div>
	)
}
