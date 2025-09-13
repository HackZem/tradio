"use client"

import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"
import { ButtonHTMLAttributes } from "react"

import { cn } from "@/utils/tw-merge"

interface UploadPhotoButtonProps {
	className?: string
}

export function UploadPhotoButton({
	className,
	...props
}: UploadPhotoButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
	const t = useTranslations("user.profile.avatar")

	return (
		<button
			{...props}
			type='button'
			className={cn(
				`hover:border-muted-foreground group relative aspect-square w-full
				border-4 border-dashed border-black active:border-black`,
				className,
			)}
		>
			<Icon
				icon={"material-symbols:upload"}
				width={65}
				className='group-hover:text-muted-foreground
					group-active:text-foreground'
			/>
			<p
				className='text-muted-foreground group-hover:text-foreground absolute
					right-0 left-0 mx-auto w-full max-w-[225px] text-sm'
			>
				{t("description")}
			</p>
		</button>
	)
}
