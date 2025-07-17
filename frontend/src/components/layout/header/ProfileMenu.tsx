"use client"

import { Icon } from "@iconify/react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/common/DropdownMenu"
import { UserAvatar } from "@/components/ui/elements/UserAvatar"

import { useLogoutUserMutation } from "@/graphql/generated/output"

import { useAuth } from "@/hooks/useAuth"
import { useCurrent } from "@/hooks/useCurrent"

import { Notifications } from "./notifications/Notifications"

export function ProfileMenu() {
	const t = useTranslations("layout.header.menu.dropdown")

	const router = useRouter()

	const { exit } = useAuth()
	const { user, isLoadingProfile } = useCurrent()

	const [logout] = useLogoutUserMutation({
		onCompleted() {
			exit()
			router.replace("/account/login")
			toast.success(t("successMessage"))
		},
		onError() {
			toast.error(t("errorMessage"))
		},
	})

	return isLoadingProfile || !user ? (
		<Icon icon='eos-icons:bubble-loading' />
	) : (
		<div className='flex gap-x-[30px]'>
			<Notifications />
			<DropdownMenu>
				<DropdownMenuTrigger>
					<UserAvatar user={user} />
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' className='w-[180px] px-3 py-4'>
					<div className='flex w-full justify-center'>
						<h2 className='mb-1 text-xl font-bold'>{user.username}</h2>
					</div>
					<Link href={`/users/${user.username}`}>
						<DropdownMenuItem className='text-xl'>
							<Icon
								icon={"lucide:user"}
								width={2}
								className='hover:text-accent-foreground'
							/>
							{t("profile")}
						</DropdownMenuItem>
					</Link>
					<Link href={`/my-lots`}>
						<DropdownMenuItem className='text-xl'>
							<Icon
								icon={"ic:round-gavel"}
								width={2}
								className='hover:text-accent-foreground'
							/>
							{t("myLots")}
						</DropdownMenuItem>
					</Link>
					<Link href={`/settings`}>
						<DropdownMenuItem className='text-xl'>
							<Icon
								icon={"fluent:settings-48-regular"}
								width={2}
								className='hover:text-accent-foreground'
							/>
							{t("settings")}
						</DropdownMenuItem>
					</Link>
					<DropdownMenuItem
						className='text-destructive text-xl'
						onClick={() => logout()}
					>
						<Icon
							icon={"humbleicons:logout"}
							width={2}
							className='hover:text-accent-foreground'
						/>
						{t("logout")}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
