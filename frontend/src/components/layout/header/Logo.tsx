import Image from "next/image"
import Link from "next/link"

export function Logo() {
	return (
		<Link href='/'>
			<Image
				src='/images/logo.svg'
				alt='Tradio'
				className='transition-opacity hover:opacity-70'
				width={50}
				height={39}
			/>
		</Link>
	)
}
