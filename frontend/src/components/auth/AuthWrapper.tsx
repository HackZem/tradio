import Link from "next/link"
import { PropsWithChildren } from "react"

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/common/Card"

interface AuthWrapperProps {
	heading: string
	backLabel: string
	backButtonLabel: string
	backButtonHref: string
}

export function AuthWrapper({
	children,
	heading,
	backButtonHref,
	backButtonLabel,
	backLabel,
}: PropsWithChildren<AuthWrapperProps>) {
	return (
		<div className='flex h-full w-full items-center justify-center backdrop-brightness-50'>
			<Card className='w-[26rem]'>
				<CardHeader className='flex-row items-center justify-center text-[2rem]'>
					<CardTitle>{heading}</CardTitle>
				</CardHeader>
				<CardContent>{children}</CardContent>
				<CardFooter className='-mt-2'>
					{backLabel}{" "}
					<Link href={backButtonHref} className='text-primary ml-2'>
						{backButtonLabel}
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
