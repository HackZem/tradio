"use client"

import { useTranslations } from "next-intl"
import { PropsWithChildren } from "react"

import {
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTrigger,
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
} from "../common/AlertDialog"

interface ConfirmDialogProps {
	heading: string
	message: string
	onConfirm: () => void
}

export function ConfirmDialog({
	heading,
	message,
	onConfirm,
	children,
}: PropsWithChildren<ConfirmDialogProps>) {
	const t = useTranslations("elements.confirmDialog")

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
			<AlertDialogContent className='py-[25px]'>
				<AlertDialogHeader>
					<AlertDialogTitle className='mx-auto'>{heading}</AlertDialogTitle>
					<AlertDialogDescription>{message}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
					<AlertDialogAction onClick={onConfirm} variant={"destructive"}>
						{t("delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
