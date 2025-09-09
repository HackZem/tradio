import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"
import Link from "next/link"

import { Heading } from "@/components/ui/elements/Heading"

export default function AboutPage() {
	const t = useTranslations("about")

	const features: string[] = t.raw("features.list")

	return (
		<div className='mx-auto flex max-w-[1200px] flex-col gap-y-6 text-[32px]'>
			<Heading size={"2xl"} title={t("heading")} className='self-center' />
			<p>{t("description")}</p>
			<div>
				<span className='font-bold'>{t("features.heading")}:</span>
				<ul className='space-y-3'>
					{features.map((text, i) => (
						<li key={i} className='flex items-center gap-x-4'>
							<Icon
								icon={"prime:check-circle"}
								className='text-green-600'
								width={32}
							/>
							{text}
						</li>
					))}
				</ul>
			</div>
			<p>{t("addition")}</p>
			<div>
				<span className='font-bold'>{t("authorLabel")}:</span> {t("author")}
			</div>
			<div>
				<span className='font-bold'>{t("githubLabel")}:</span>{" "}
				<Link href={t("github")} className='text-accent hover:text-accent/80'>
					{t("github")}
				</Link>
			</div>
		</div>
	)
}
