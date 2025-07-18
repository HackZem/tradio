import type { PropsWithChildren } from "react"

export function LayoutContainer({ children }: PropsWithChildren<unknown>) {
	return <main className='mt-[165px]'>{children}</main>
}
