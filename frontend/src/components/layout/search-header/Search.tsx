"use client"

import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

import { Button } from "@/components/ui/common/Button"
import { Input } from "@/components/ui/common/Input"

export function Search() {
	const t = useTranslations("layout.searchHeader")

	const [query, setQuery] = useState<string>("")

	const router = useRouter()

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (query.trim()) {
			router.push(`/lots?query=${query}`)
		} else {
			router.push(`/lots`)
		}
	}

	return (
		<div>
			<form className='flex items-center gap-2.5' onSubmit={onSubmit}>
				<div className='relative flex items-center'>
					<Input
						type='text'
						value={query}
						onChange={e => setQuery(e.target.value)}
						className='h-12 w-full px-11 lg:w-[524px]'
					/>
					<Icon
						icon={"prime:search"}
						width='35'
						className='absolute left-1.5'
					/>
					<Icon
						icon='lets-icons:close-round'
						width='28'
						className='hover:text-destructive absolute right-2.5 hover:cursor-pointer'
						onClick={() => setQuery("")}
					/>
				</div>
				<Button type='submit'>{t("search")}</Button>
			</form>
		</div>
	)
}
