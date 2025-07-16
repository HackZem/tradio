"use client"

import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

import { useVerifyAccountMutation } from "@/graphql/generated/output"

import { useAuth } from "@/hooks/useAuth"

import { AuthWrapper } from "../AuthWrapper"

export function VerifyAccountForm() {
	const t = useTranslations("auth.verify")

	const { auth } = useAuth()

	const router = useRouter()

	const searchParams = useSearchParams()

	const token = searchParams.get("token") ?? ""

	const [verify] = useVerifyAccountMutation({
		onCompleted() {
			auth()
			toast.success(t("successMessage"))
			router.replace("/")
		},
		onError() {
			toast.error(t("errorMessage"))
		},
	})

	useEffect(() => {
		verify({
			variables: {
				data: { token },
			},
		})
	}, [token])

	return (
		<AuthWrapper heading={t("heading")}>
			<div className='flex items-center justify-center'>
				<Icon className='mt-4' icon='eos-icons:bubble-loading' width='5rem' />
			</div>
		</AuthWrapper>
	)
}
