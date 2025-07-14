import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/common/Button"

import { Search } from "./Search"

interface Props {}

export function SearchHeader({}: Props) {
	const t = useTranslations("layout.searchHeader")

	return (
		<header className='border-border bg-card flex h-[90px] items-center justify-center gap-x-2.5'>
			<Button
				variant='outline'
				size={"default"}
				className='border-black text-black hover:bg-black active:bg-black/70'
			>
				{t("categories")}
			</Button>
			<Search />
		</header>
	)
}
