import type { PropsWithChildren } from "react"

export function LayoutContainer({ children }: PropsWithChildren<unknown>) {
	return <main className='mt-[165px] px-5'>{children}</main>
}
