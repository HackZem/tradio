"use client"

import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"
import { ButtonHTMLAttributes } from "react"

export function ChangeAvatarButton(
	props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
	const t = useTranslations("user.profile.avatar")

	return (
		<button
			{...props}
			className='hover:border-muted-foreground group relative aspect-square w-full max-w-[300px] rounded-full border-4 border-dashed border-black active:border-black'
		>
			<Icon
				icon={"material-symbols:upload"}
				width={65}
				className='group-hover:text-muted-foreground group-active:text-foreground'
			/>
			<p className='text-muted-foreground group-hover:text-foreground absolute right-0 left-0 mx-auto w-full max-w-[225px] text-sm'>
				{t("description")}
			</p>
		</button>
	)
}
