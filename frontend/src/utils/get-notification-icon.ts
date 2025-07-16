import { NotificationType } from "@/graphql/generated/output"

const notificationIconMap = new Map<NotificationType, string>([
	[NotificationType.NewBid, "ic:baseline-new-releases"],
	[NotificationType.LotEnded, "ic:baseline-new-releases"],
	[NotificationType.LotEnding, "mdi:alarm-clock"],
	[NotificationType.LotLost, "healthicons:no-outline-24px"],
	[NotificationType.LotWon, "icon-park-outline:check-one"],
	[NotificationType.Outbid, "healthicons:no-outline-24px"],
	[NotificationType.Other, "mdi:bell-outline"],
])

export function getNotificationIcon(type: NotificationType) {
	return notificationIconMap.get(type) || "mdi:bell-outline"
}
