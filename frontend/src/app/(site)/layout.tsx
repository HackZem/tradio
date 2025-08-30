import type { PropsWithChildren } from "react"

import { LayoutContainer } from "@/components/layout/LayoutContainer"
import { Header } from "@/components/layout/header/Header"
import { SearchHeader } from "@/components/layout/search-header/SearchHeader"

export default function SiteLayout({ children }: PropsWithChildren<unknown>) {
	return (
		<div className='flex h-full flex-col'>
			<div className='flex-1'>
				<div className='sticky inset-y-0 z-50 h-min w-full bg-card'>
					<Header />
					<SearchHeader />
				</div>
				<LayoutContainer>{children}</LayoutContainer>
			</div>
		</div>
	)
}
