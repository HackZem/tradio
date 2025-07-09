import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { CreateAccountForm } from "@/components/auth/forms/CreateAccountForm"

export const generateMetadata = async (): Promise<Metadata> => {
	const t = await getTranslations("auth.register")

	return {
		title: t("heading"),
	}
}

export default function CreateAccountPage() {
	return <CreateAccountForm />
}
