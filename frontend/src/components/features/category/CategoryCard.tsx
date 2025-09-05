import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/common/Card"

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
				className='aspect-square transition-transform hover:scale-105'
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
					<h2
						className='absolute -bottom-4 left-5 text-[clamp(20px,2vw,32px)]
							leading-[1.2em] font-normal'
					>
						{heading}
					</h2>
				</div>
			</Card>
		</Link>
	)
}
