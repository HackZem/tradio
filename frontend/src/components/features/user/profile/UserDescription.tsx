"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import EditableText from "@/components/ui/elements/EditableText"
import { Heading } from "@/components/ui/elements/Heading"

import { useChangeProfileInfoMutation } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

export function UserDescription() {
	const t = useTranslations("user.profile.description")

	const { user, refetch } = useCurrent()

	const [description, setDescription] = useState<string>(
		user?.description ?? "",
	)

	const [change] = useChangeProfileInfoMutation({
		onCompleted() {
			refetch()
			toast.success(t("successChangedMessage"))
		},
		onError() {
			toast.error(t("errorChangedMessage"))
		},
	})

	function descriptionChangeHandler(value: string) {
		if (user?.description === value) return

		setDescription(value)

		change({ variables: { data: { description: value } } })
	}

	return (
		<>
			<Heading title={t("heading")} size={"lg"} />
			<EditableText
				value={description}
				onChange={value => descriptionChangeHandler(value)}
				placeholder={t("empty")}
				className='text-xl'
			/>
		</>
	)
}
