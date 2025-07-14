import { ChackEmailForm } from "@/components/features/auth/forms/CheckEmailForm"
import { VerifyAccountForm } from "@/components/features/auth/forms/VerifyAccountForm"

interface VerifyAccountPageProps {
	searchParams: Promise<{ token: string }>
}

export default async function VerifyAccountPage({
	searchParams,
}: VerifyAccountPageProps) {
	const { token } = await searchParams

	return token ? <VerifyAccountForm /> : <ChackEmailForm />
}
