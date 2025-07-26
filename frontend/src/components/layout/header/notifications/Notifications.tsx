import { Icon } from "@iconify-icon/react"

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/common/Popover"

import { useFindUnreadNotificationsCountQuery } from "@/graphql/generated/output"

import { NotificationsList } from "./NotificationsList"

export function Notifications() {
	const { data, loading: isLoadingUnreadCount } =
		useFindUnreadNotificationsCountQuery()

	const unreadCount = data?.findUnreadNotificationsCount ?? 0

	const displayCount = unreadCount > 99 ? "+99" : unreadCount

	if (isLoadingUnreadCount) return null

	return (
		<Popover>
			<PopoverTrigger className='relative'>
				{unreadCount !== 0 && (
					<div className='bg-primary absolute -top-1.5 -right-1.5 rounded-full px-1.5 text-sm font-semibold text-white'>
						{displayCount}
					</div>
				)}
				<Icon
					icon={"mdi:bell-outline"}
					width={26}
					className='text-foreground -mb-1'
				/>
			</PopoverTrigger>
			<PopoverContent
				align='end'
				className='max-h-[500px] w-[360px] overflow-y-auto'
			>
				<NotificationsList />
			</PopoverContent>
		</Popover>
	)
}
