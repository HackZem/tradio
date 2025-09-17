"use client"

import { Icon } from "@iconify-icon/react"
import { Editor, useEditorState } from "@tiptap/react"

import { Button } from "@/components/ui/common/Button"
import { Toggle } from "@/components/ui/common/Toggle"

interface MenuBarProps {
	editor: Editor
}

export function MenuBar({ editor }: MenuBarProps) {
	const editorState = useEditorState({
		editor,
		selector: ctx => {
			return {
				isBold: ctx.editor.isActive("bold") ?? false,
				canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
				isItalic: ctx.editor.isActive("italic") ?? false,
				canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
				isStrike: ctx.editor.isActive("strike") ?? false,
				canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
				isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
				isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
				isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
				isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
				isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
				isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
				isBulletList: ctx.editor.isActive("bulletList") ?? false,
				isOrderedList: ctx.editor.isActive("orderedList") ?? false,
				isBlockquote: ctx.editor.isActive("blockquote") ?? false,
				canUndo: ctx.editor.can().chain().undo().run() ?? false,
				canRedo: ctx.editor.can().chain().redo().run() ?? false,
				canTextAlignRight: ctx.editor.can().chain().toggleTextAlign("right"),
				canTextAlignLeft: ctx.editor.can().chain().toggleTextAlign("left"),
				canTextAlignCenter: ctx.editor.can().chain().toggleTextAlign("center"),
				isTextAlignRight: ctx.editor.isActive({ textAlign: "right" }) ?? false,
				isTextAlignLeft: ctx.editor.isActive({ textAlign: "left" }) ?? false,
				isTextAlignCenter:
					ctx.editor.isActive({ textAlign: "center" }) ?? false,
			}
		},
	})

	return (
		<div className='control-group'>
			<div className='button-group flex items-center'>
				<Button
					type='button'
					variant={"ghost"}
					size={"icon"}
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editorState.canUndo}
				>
					<Icon icon='material-symbols:undo-rounded' width={20} />
				</Button>
				<Button
					type='button'
					variant={"ghost"}
					size={"icon"}
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editorState.canRedo}
				>
					<Icon icon='material-symbols:redo-rounded' width={20} />
				</Button>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleBold().run()}
					disabled={!editorState.canBold}
					pressed={editorState.isBold}
				>
					<Icon icon='tabler:bold' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editorState.canItalic}
					pressed={editorState.isItalic}
				>
					<Icon icon='mingcute:italic-line' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editorState.canStrike}
					pressed={editorState.isStrike}
				>
					<Icon icon='solar:text-cross-bold' width={20} />
				</Toggle>
				<Toggle
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					pressed={editorState.isHeading1}
				>
					<Icon icon='mingcute:heading-1-line' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					pressed={editorState.isHeading2}
				>
					<Icon icon='mingcute:heading-2-line' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					pressed={editorState.isHeading3}
				>
					<Icon icon='mingcute:heading-3-line' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					pressed={editorState.isBulletList}
				>
					<Icon icon='fluent:text-bullet-list-24-filled' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					pressed={editorState.isOrderedList}
				>
					<Icon icon='mingcute:list-ordered-line' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					pressed={editorState.isBlockquote}
				>
					<Icon icon='sidekickicons:blockquote' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleTextAlign("left").run()}
					disabled={!editorState.canTextAlignLeft}
					pressed={editorState.isTextAlignLeft}
				>
					<Icon icon='fluent:text-align-left-20-filled' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleTextAlign("center").run()}
					disabled={!editorState.canTextAlignCenter}
					pressed={editorState.isTextAlignCenter}
				>
					<Icon icon='fluent:text-align-center-20-filled' width={20} />
				</Toggle>
				<Toggle
					type='button'
					onClick={() => editor.chain().focus().toggleTextAlign("right").run()}
					disabled={!editorState.canTextAlignRight}
					pressed={editorState.isTextAlignRight}
				>
					<Icon icon='fluent:text-align-right-20-filled' width={20} />
				</Toggle>
				<Button
					type='button'
					variant={"ghost"}
					size={"icon"}
					onClick={() => editor.chain().focus().setHorizontalRule().run()}
				>
					<Icon icon='garden:horizontal-rule-fill-16' width={20} />
				</Button>
			</div>
		</div>
	)
}
