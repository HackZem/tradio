import { cva, type VariantProps } from "class-variance-authority"

import { FindProfileQuery } from "@/graphql/generated/output"

import { getMediaSource } from "@/utils/get-media-source"
import { cn } from "@/utils/tw-merge"

import { Avatar, AvatarFallback, AvatarImage } from "../common/Avatar"

const avatarSizes = cva("", {
	variants: {
		size: {
			sm: "size-[45px]",
			default: "size-15 text-2xl",
			lg: "size-40 text-6xl",
		},
	},
	defaultVariants: {
		size: "default",
	},
})

interface UserAvatarProps extends VariantProps<typeof avatarSizes> {
	user: Pick<FindProfileQuery["findProfile"], "username" | "avatar">
	className?: string
}

export function UserAvatar({ size, user, className }: UserAvatarProps) {
	const { username, avatar } = user

	return (
		<div className={cn("relative", className)}>
			<Avatar className={cn(avatarSizes({ size }))}>
				<AvatarImage
					src={avatar ? getMediaSource(avatar) : undefined}
					className='object-cover'
				/>
				<AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
			</Avatar>
		</div>
	)
}
