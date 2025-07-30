"use client"

import { PropsWithChildren, ReactNode } from "react"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../common/Dialog"

interface ChangeDialogProps {
	trigger: ReactNode
	isOpen: boolean
	heading: string
	onOpenChange: (open: boolean) => void
}

export function ChangeDialog({
	children,
	trigger,
	isOpen,
	heading,
	onOpenChange,
}: PropsWithChildren<ChangeDialogProps>) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className='flex w-full max-w-[26rem] flex-col items-center py-[25px]'>
				<DialogHeader>
					<DialogTitle className='text-[32px]'>{heading}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}
