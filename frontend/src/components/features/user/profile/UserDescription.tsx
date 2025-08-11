"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import {
	FormField,
	FormItem,
	FormControl,
	Form,
} from "@/components/ui/common/Form"
import EditableText from "@/components/ui/elements/EditableText"
import { Heading } from "@/components/ui/elements/Heading"

import { useChangeProfileInfoMutation } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import {
	CHARACTERS_BEFORE_HIGHLIGHT,
	MAX_DESCRIPTION_LENGTH,
} from "@/libs/constants/data.constants"

import { cn } from "@/utils/tw-merge"

import { changeDescriptionSchema } from "@/schemas/user/change-info.schema"

type TChangeDescriptionSchema = z.infer<typeof changeDescriptionSchema>

export function UserDescription() {
	const t = useTranslations("user.profile.description")

	const { user, isLoadingProfile, refetch } = useCurrent()

	const form = useForm<TChangeDescriptionSchema>({
		resolver: zodResolver(changeDescriptionSchema),
		values: {
			description: user?.description ?? "",
		},
	})

	const [descriptionLength, setDescriptionLength] = useState<number>(
		user?.description?.length ?? 0,
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

	async function descriptionChangeHandler(value: string) {
		if (user?.description === value) return

		const isValid = await form.trigger("description")

		if (isValid) {
			change({ variables: { data: { description: value } } })
		}
	}

	const isLimitSoon =
		MAX_DESCRIPTION_LENGTH - descriptionLength <= CHARACTERS_BEFORE_HIGHLIGHT

	return (
		!isLoadingProfile &&
		user && (
			<Form {...form}>
				<div className='flex items-center gap-x-4'>
					<Heading title={t("heading")} size={"lg"} />
					<span className={cn("-mb-0.5", isLimitSoon && "text-destructive")}>
						{descriptionLength}/{MAX_DESCRIPTION_LENGTH}
					</span>
				</div>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<EditableText
							value={field.value}
							onChange={value => {
								field.onChange(value)
								descriptionChangeHandler(value)
							}}
							onPreviewChange={value => setDescriptionLength(value.length)}
							placeholder={t("empty")}
							className='text-xl'
						/>
					)}
				/>
			</Form>
		)
	)
}
