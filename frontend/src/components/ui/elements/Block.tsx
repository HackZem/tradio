import { PropsWithChildren } from "react"

import { Heading } from "./Heading"

interface BlockProps {
	heading: string
}

export function Block({ children, heading }: PropsWithChildren<BlockProps>) {
	return (
		<div className='space-y-5'>
			<Heading size={"lg"} title={heading} />
			<div>{children}</div>
		</div>
	)
}
