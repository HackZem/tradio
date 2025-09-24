"use client"

import TextAlign from "@tiptap/extension-text-align"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/common/Card"
import { Heading } from "@/components/ui/elements/Heading"

import { FindLotByIdQuery } from "@/graphql/generated/output"

interface LotDescriptionProps {
	description: FindLotByIdQuery["findLotById"]["description"]
}

export function LotDescription({ description }: LotDescriptionProps) {
	const t = useTranslations("lot.description")
	const editor = useEditor({
		extensions: [
			StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
		],
		content: description,
		editable: false,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
			},
		},
	})

	return (
		<Card className='mt-[50px] px-[25px] py-[15px]'>
			<Heading title={t("heading")} size={"lg"} />
			{editor?.isEmpty ? (
				<span className='text-muted-foreground'>{t("empty")}</span>
			) : (
				<EditorContent editor={editor} />
			)}
		</Card>
	)
}
