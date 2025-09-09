"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

import { Button } from "@/components/ui/common/Button"
import { DialogClose } from "@/components/ui/common/Dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"
import { ChangeDialog } from "@/components/ui/elements/ChangeDialog"

import { useChangeProfileInfoMutation } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { changeUsernameSchema } from "@/schemas/user/change-info.schema"

type TChangeUsernameSchema = z.infer<typeof changeUsernameSchema>

export function ChangeUsernameDialog({ children }: PropsWithChildren<unknown>) {
	const t = useTranslations("user.profile.username")

	const { user, isLoadingProfile, refetch } = useCurrent()

	const router = useRouter()

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const form = useForm<TChangeUsernameSchema>({
		resolver: zodResolver(changeUsernameSchema),
		values: {
			username: "",
		},
	})

	const { formState, watch } = form

	const { isSubmitting, isValid } = formState

	const username = watch("username")

	const [change, { loading: isLoadingChange }] = useChangeProfileInfoMutation({
		onCompleted() {
			refetch()
			toast.success(t("successChangedMessage"))
			setIsOpen(false)
			clearDialog()
			router.replace(`/users/${username}`)
		},
		onError() {
			toast.error(t("errorChangedMessage"))
		},
	})

	function handleOpenChange(isOpen: boolean) {
		setIsOpen(isOpen)

		if (!isOpen) {
			clearDialog()
		}
	}

	function clearDialog() {
		form.reset()
	}

	async function onSubmit({ username }: TChangeUsernameSchema) {
		change({ variables: { data: { username } } })
	}

	return (
		!isLoadingProfile &&
		user && (
			<ChangeDialog
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				trigger={children}
				heading={t("heading")}
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem className='mb-5'>
									<FormLabel className='text-xl'>{t("label")}</FormLabel>
									<FormControl>
										<Input {...field} disabled={isLoadingChange}></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='flex w-full gap-x-[20px]'>
							<Button
								className='max-w-[300px] flex-1'
								disabled={!isValid || isLoadingChange || isSubmitting}
							>
								{t("changeUsernameButton")}
							</Button>
							<DialogClose asChild>
								<Button
									variant={"outline"}
									className='max-w-[300px] flex-1'
									disabled={isSubmitting}
									onClick={() => {
										form.reset()
									}}
								>
									{t("cancelButton")}
								</Button>
							</DialogClose>
						</div>
					</form>
				</Form>
			</ChangeDialog>
		)
	)
}
