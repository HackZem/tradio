import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/common/Card"
import { Heading } from "@/components/ui/elements/Heading"

import { ROUTES } from "@/libs/constants/routes.constants"

interface CategoryCardProps {
	heading: string
	color: string
	slug: string
	image: string
}

export function CategoryCard({
	color,
	heading,
	image,
	slug,
}: CategoryCardProps) {
	const url = `${ROUTES.LOTS}?category=${slug}`

	return (
		<Link href={url}>
			<Card
				className='h-[300px] w-[300px] transition-transform hover:scale-105'
				style={{ backgroundColor: color }}
			>
				<div className='relative flex h-full flex-col items-center'>
					<Image
						src={image}
						alt={slug}
						width={0}
						height={0}
						sizes='100vw'
						style={{ width: "auto", height: "95%" }}
						className='-translate-y-4 object-cover'
					/>
					<Heading
						className='absolute -bottom-4 left-5 leading-9 font-normal'
						title={heading}
						size={"xl"}
					/>
				</div>
			</Card>
		</Link>
	)
}
