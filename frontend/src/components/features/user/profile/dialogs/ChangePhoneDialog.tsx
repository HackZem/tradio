"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
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
import { PhoneInput } from "@/components/ui/common/PhoneInput"
import { ChangeDialog } from "@/components/ui/elements/ChangeDialog"

import { useChangeProfileInfoMutation } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { changePhoneSchema } from "@/schemas/user/change-info.schema"

type TChangePhoneSchema = z.infer<typeof changePhoneSchema>

export function ChangePhoneDialog({ children }: PropsWithChildren<unknown>) {
	const t = useTranslations("user.profile.phone")

	const { user, isLoadingProfile, refetch } = useCurrent()

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const form = useForm<TChangePhoneSchema>({
		resolver: zodResolver(changePhoneSchema),
		values: {
			phone: "",
		},
	})

	const { isSubmitting, isValid } = form.formState

	const [change, { loading: isLoadingChange }] = useChangeProfileInfoMutation({
		onCompleted() {
			refetch()
			toast.success(t("successChangedMessage"))
			setIsOpen(false)
			clearDialog()
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

	async function onSubmit({ phone }: TChangePhoneSchema) {
		change({ variables: { data: { phone } } })
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
							name='phone'
							render={({ field }) => (
								<FormItem className='mb-5'>
									<FormLabel className='text-xl'>{t("label")}</FormLabel>
									<FormControl>
										<PhoneInput
											{...field}
											disabled={isLoadingChange || isSubmitting}
											international={true}
											defaultCountry='AT'
										/>
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
								{t("changePhoneButton")}
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
