import type { Metadata } from "next"

import { CreateAccountForm } from "@/components/auth/forms/CreateAccountForm"

export const metadata: Metadata = {
	title: "Account creation",
}

export default function CreateAccountPage() {
	return <CreateAccountForm />
}
