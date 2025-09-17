"use client"

import TextAlign from "@tiptap/extension-text-align"
import { Placeholder } from "@tiptap/extensions"
import { useEditor, EditorContent, JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useTranslations } from "next-intl"

import { Card } from "@/components/ui/common/Card"

import { MenuBar } from "./MenuBar"

interface LotDescriptionEditorProps {
	description: JSONContent | string
	onChange: (description: JSONContent) => void
}

export function LotDescriptionEditor({
	description,
	onChange,
}: LotDescriptionEditorProps) {
	const t = useTranslations("lot.form.description")

	const editor = useEditor({
		extensions: [
			StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			Placeholder.configure({ placeholder: t("placeholder") }),
		],
		content: description,
		onUpdate({ editor }) {
			const content = editor.getJSON()
			onChange(content)
		},
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
			},
		},
	})

	return (
		<Card className='px-[25px] py-[15px]'>
			{editor && <MenuBar editor={editor} />}
			<EditorContent editor={editor} />
		</Card>
	)
}
