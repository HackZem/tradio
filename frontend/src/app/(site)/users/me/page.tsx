import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { MyProfile } from "@/components/features/user/profile/MyProfile"

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("user.profile")

	return {
		title: t("heading"),
	}
}

export default function ProfilePage() {
	return (
		<div>
			<MyProfile />
		</div>
	)
}
