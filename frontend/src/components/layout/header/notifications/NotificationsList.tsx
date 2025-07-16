"use client"

import { Icon } from "@iconify/react"
import { formatDistance } from "date-fns"
import { useTranslations } from "next-intl"
import { Fragment } from "react"

import {
	useFindNotificationsByUserQuery,
	useFindUnreadNotificationsCountQuery,
} from "@/graphql/generated/output"

import { getNotificationIcon } from "@/utils/get-notification-icon"

export function NotificationsList() {
	const t = useTranslations("layout.header.menu.notifications")

	const { refetch } = useFindUnreadNotificationsCountQuery()

	const { data, loading: isLoadingNotifications } =
		useFindNotificationsByUserQuery({
			variables: { data: { take: 50, skip: 0 } },
			onCompleted() {
				refetch()
			},
		})

	const notifications = data?.findNotificationByUser ?? []

	return (
		<>
			<h2 className='mb-3 text-center text-xl font-bold'>{t("heading")}</h2>
			{isLoadingNotifications ? (
				<div className='flex items-center justify-center'>
					<Icon className='mt-4' icon='eos-icons:bubble-loading' width='3rem' />
				</div>
			) : !notifications.length ? (
				<div className='text-muted-foreground py-4 text-center'>
					{t("empty")}
				</div>
			) : (
				<div className='flex flex-col gap-y-4 overflow-y-auto'>
					{notifications.map(notification => {
						return (
							<Fragment key={notification.id}>
								<div className='flex gap-x-3 p-1'>
									<Icon
										icon={getNotificationIcon(notification.type)}
										width={35}
										className='mt-1 min-w-[35px]'
									/>
									<div className='flex flex-col gap-y-[2px]'>
										<div className='flex justify-between'>
											<h2 className='text-4 font-bold'>{notification.title}</h2>
											<span>
												{formatDistance(
													new Date(notification.createdAt),
													new Date(),
													{ addSuffix: true },
												)}
											</span>
										</div>
										<p className='text-4'>{notification.description}</p>
									</div>
								</div>
							</Fragment>
						)
					})}
				</div>
			)}
		</>
	)
}
