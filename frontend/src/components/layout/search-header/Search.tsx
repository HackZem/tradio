"use client"

import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"
import { FormEvent, useEffect, useState } from "react"

import { Button } from "@/components/ui/common/Button"
import { Input } from "@/components/ui/common/Input"

import { useLotFiltersStore } from "@/store/lot-filters/lot-filters.store"

export function Search() {
	const t = useTranslations("layout.searchHeader")

	const { query: initialQuery, setQuery: setQueryToStore } =
		useLotFiltersStore()

	const [query, setQuery] = useState<string>(initialQuery)

	useEffect(() => setQuery(initialQuery), [initialQuery])

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		setQueryToStore(query)
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
						className='hover:text-destructive absolute right-2.5 cursor-pointer'
						onClick={() => setQuery("")}
					/>
				</div>
				<Button type='submit'>{t("search")}</Button>
			</form>
		</div>
	)
}
