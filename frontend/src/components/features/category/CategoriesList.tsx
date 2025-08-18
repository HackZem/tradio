"use client"

import { useTranslations } from "next-intl"

import { Block } from "@/components/ui/elements/Block"

import { CategoryCard } from "./CategoryCard"

export interface Category {
	heading: string
	color: string
	slug: string
	image: string
}

const TOP_CATEGORIES: Category[] = [
	{
		heading: "Electronics",
		slug: "electronics",
		color: "#94A6F0",
		image: "/images/category/electronics.png",
	},
	{
		heading: "Jewelry & Accessories",
		slug: "jewelry-and-accessories",
		color: "#FFCC3F",
		image: "/images/category/jewelry-and-accessories.png",
	},
	{
		heading: "Home & Garden",
		slug: "home-and-garden",
		color: "#86DE56",
		image: "/images/category/home-and-garden.png",
	},
	{
		heading: "Auto Parts & Accessories",
		slug: "auto-parts-and-accessories",
		color: "#BDBDBE",
		image: "/images/category/auto-parts-and-accessories.png",
	},
	{
		heading: "Clothing",
		slug: "clothing",
		color: "#FF8C8C",
		image: "/images/category/clothing.png",
	},
] as const

export function CategoriesList() {
	const t = useTranslations("home")

	return (
		<Block heading={t("categoriesHeading")}>
			<div className='flex w-full gap-x-5'>
				{TOP_CATEGORIES.map(category => (
					<div className='flex-1' key={category.slug}>
						<CategoryCard {...category} />
					</div>
				))}
			</div>
		</Block>
	)
}
