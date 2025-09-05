import type { Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import { Roboto } from "next/font/google"

import { TimerStarter } from "@/components/layout/TimerStarter"
import { TooltipProvider } from "@/components/ui/common/Tooltip"

import { ApolloClientProvider } from "@/providers/ApolloClientProvider"
import { LotFiltersProvider } from "@/providers/LotFiltersProvider"
import { ToasterProvider } from "@/providers/ToastProvider"

import "../styles/globals.css"

const robotoSans = Roboto({
	variable: "--font-roboto-sans",
	subsets: ["latin"],
	weight: ["400", "700"],
})

export const metadata: Metadata = {
	title: "Tradio",
	description: "Auction for all your belongings",
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const locale = await getLocale()
	const messages = await getMessages()

	return (
		<html lang={locale}>
			<body className={`${robotoSans.variable} antialiased`}>
				<ApolloClientProvider>
					<NextIntlClientProvider messages={messages}>
						<TooltipProvider>
							<LotFiltersProvider>
								<ToasterProvider />
								{children}
							</LotFiltersProvider>
						</TooltipProvider>
					</NextIntlClientProvider>
				</ApolloClientProvider>
				<TimerStarter />
			</body>
		</html>
	)
}
