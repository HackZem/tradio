import { Icon } from "@iconify-icon/react"
import { ButtonHTMLAttributes } from "react"

export function ChangeAvatarButton(
	props: ButtonHTMLAttributes<HTMLButtonElement>,
) {
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
				The file will support: png, jpeg, jpg and webp. Maximum size 10 MB
			</p>
		</button>
	)
}
