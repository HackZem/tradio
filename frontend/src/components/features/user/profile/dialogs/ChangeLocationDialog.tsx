"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Alpha2Code } from "i18n-iso-countries"
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
import { ChangeDialog } from "@/components/ui/elements/ChangeDialog"
import { CountryCombobox } from "@/components/ui/elements/CountryCombobox"
import { RegionCombobox } from "@/components/ui/elements/RegionCombobox"

import { useChangeProfileInfoMutation } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import { changeLocationSchema } from "@/schemas/user/change-info.schema"

type TChangeLocationSchema = z.infer<typeof changeLocationSchema>

export function ChangeLocationDialog({ children }: PropsWithChildren<unknown>) {
	const t = useTranslations("user.profile.location")

	const { user, isLoadingProfile, refetch } = useCurrent()

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const form = useForm<TChangeLocationSchema>({
		resolver: zodResolver(changeLocationSchema),
		values: {
			country: "",
			region: "",
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

	async function onSubmit({ country, region }: TChangeLocationSchema) {
		change({ variables: { data: { country, region } } })
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
							name='country'
							render={({ field }) => (
								<FormItem className='mb-5'>
									<FormLabel className='text-xl'>{t("countryLabel")}</FormLabel>
									<FormControl>
										<CountryCombobox
											value={field.value}
											onValueChange={e => {
												field.onChange(e)
												form.resetField("region")
											}}
											disabled={isSubmitting || isLoadingChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='region'
							render={({ field }) => (
								<FormItem className='mb-5'>
									<FormLabel className='text-xl'>{t("regionLabel")}</FormLabel>
									<FormControl>
										<RegionCombobox
											country={form.getValues("country") as Alpha2Code}
											value={field.value}
											onValueChange={field.onChange}
											disabled={isSubmitting || isLoadingChange}
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
								{t("changeLocationButton")}
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
