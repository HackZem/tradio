import { NotificationType } from "@prisma/client"

export const NOTIFICATIONS = {
	newBid: {
		toAutor: (amount: number, title: string, autorId: string) => {
			return {
				title: "New Bid",
				description: `New bid ${amount}€ on your lot ${title}`,
				isRead: false,
				type: NotificationType.NEW_BID,
				userId: autorId,
			}
		},
		toUser: (amount: number, title: string, userId: string) => {
			return {
				title: "New Bid",
				description: `New bid ${amount}€ on lot ${title}`,
				isRead: false,
				type: NotificationType.NEW_BID,
				userId: userId,
			}
		},
		toOutbidUser: (
			previousAmount: number,
			amount: number,
			title: string,
			userId: string,
		) => {
			return {
				title: "Your bid has been outbid",
				description: `Your bid of ${previousAmount}€ on lot ${title} has been outbid. The new bid is ${amount}€`,
				isRead: false,
				type: NotificationType.NEW_BID,
				userId: userId,
			}
		},
	},
	lotEnding: {
		toAutor: (minutes: number, title: string, autorId: string) => {
			return {
				title: "Lot Ending",
				description: `Your lot ${title} ends in ${minutes} minutes`,
				isRead: false,
				type: NotificationType.LOT_ENDING,
				userId: autorId,
			}
		},
		toUser: (minutes: number, title: string, userId: string) => {
			return {
				title: "Lot Ending",
				description: `Lot ${title} ends in ${minutes} minutes`,
				isRead: false,
				type: NotificationType.LOT_ENDING,
				userId: userId,
			}
		},
	},
	lotEnded: {
		toAutor: (amount: number, title: string, autorId: string) => {
			return {
				title: "Lot Ended",
				description: `Your lot ${title} ended at the amount of ${amount}€`,
				isRead: false,
				type: NotificationType.LOT_ENDED,
				userId: autorId,
			}
		},
		toWonUser: (amount: number, title: string, userId: string) => {
			return {
				title: "You won",
				description: `You won the lot ${title} for ${amount}€`,
				isRead: false,
				type: NotificationType.LOT_WON,
				userId,
			}
		},
		toLostUser: (amount: number, title: string, userId: string) => {
			return {
				title: "You lost",
				description: `You lost the lot ${title} for ${amount}€`,
				isRead: false,
				type: NotificationType.LOT_LOST,
				userId,
			}
		},
		toUser: (amount: number, title: string, userId: string) => {
			return {
				title: "Lot Ended",
				description: `The lot ${title} ended at the amount of ${amount}€`,
				isRead: false,
				type: NotificationType.LOT_ENDED,
				userId,
			}
		},
	},
} as const
