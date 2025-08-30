import type { PropsWithChildren } from "react"

export function LayoutContainer({ children }: PropsWithChildren<unknown>) {
	return <main className='px-5'>{children}</main>
}
