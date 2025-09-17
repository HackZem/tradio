"use client"

import { Icon } from "@iconify-icon/react"
import _ from "lodash"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { Card } from "@/components/ui/common/Card"
import { UploadPhotoButton } from "@/components/ui/elements/ChangeAvatarButton"
import { ConfirmDialog } from "@/components/ui/elements/ConfirmDialog"

import { FindLotByIdQuery } from "@/graphql/generated/output"

import { ALLOWED_FILE_FORMATS } from "@/libs/constants/image.constants"

import { getMediaSource } from "@/utils/get-media-source"
import { cn } from "@/utils/tw-merge"

import uploadFileSchema from "@/schemas/upload-file.schema"

interface LotPhotosEditorProps {
	photos: FindLotByIdQuery["findLotById"]["photos"]
	onChange: (photos: FindLotByIdQuery["findLotById"]["photos"]) => void
}

export function LotPhotosEditor({ photos, onChange }: LotPhotosEditorProps) {
	const t = useTranslations("lot.form")

	const selectedImageRef = useRef<HTMLDivElement>(null)

	const [scrollImagesHeight, setScrollImagesHeight] = useState<number>(630)

	const [selectedLotIndex, setSelectedLotIndex] = useState<number>(0)

	const [editingIndex, setEditingIndex] = useState<number | null>(null)

	useEffect(() => {
		if (!selectedImageRef.current) return

		const observer = new ResizeObserver(entries => {
			for (let entry of entries) {
				setScrollImagesHeight(entry.contentRect.height)
			}
		})

		observer.observe(selectedImageRef.current)

		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		const photosCount = photos?.length

		if (!photosCount) {
			setSelectedLotIndex(0)
		} else if (selectedLotIndex >= photosCount) {
			setSelectedLotIndex(photosCount - 1)
		}
	}, [photos, selectedLotIndex])

	async function imageUpload(file?: File) {
		if (!file) {
			setEditingIndex(null)
			return
		}

		const isValid = uploadFileSchema.parse({ file })

		if (!isValid) {
			toast.error(t("errorUploadMessage"), {
				description: t("errorUploadDescription"),
			})
			setEditingIndex(null)
			return
		}

		const url = URL.createObjectURL(file)

		if (editingIndex !== null && photos?.length) {
			const updatedPhotos = [...photos]
			updatedPhotos[editingIndex].key = url
			setEditingIndex(null)
			onChange(updatedPhotos)
		} else {
			onChange([...(photos ?? []), { key: url, order: photos?.length ?? 0 }])
		}
	}

	const { getRootProps, getInputProps, open } = useDropzone({
		onDrop: (files: File[]) => {
			if (files && files.length > 0) {
				const file = files[0]
				imageUpload(file)
			}
		},
		onFileDialogCancel() {
			setEditingIndex(null)
		},
		maxFiles: 1,
		accept: ALLOWED_FILE_FORMATS.reduce<Record<string, string[]>>(
			(acc, mime) => {
				acc[mime] = []
				return acc
			},
			{},
		),
	})

	return (
		<div
			className='grid w-full grid-cols-[1fr_3fr] justify-between'
			style={{
				height: scrollImagesHeight,
			}}
		>
			<div
				className='scrollbar-hidden relative flex w-full flex-col gap-y-2.5
					overflow-y-auto px-[12px] py-[4px]'
			>
				{photos
					?.sort((a, b) => a.order - b.order)
					.map((photo, i) => (
						<Card
							className={cn(
								`relative aspect-square w-full shrink-0 cursor-pointer
								overflow-hidden`,
								selectedLotIndex === i && "ring-accent ring-4",
							)}
							onClick={() => setSelectedLotIndex(i)}
							key={i}
						>
							<Image
								src={
									photo.key.startsWith("blob:")
										? photo.key
										: getMediaSource(photo.key)
								}
								alt={`Image ${i + 1}`}
								fill
								className='object-contain'
							/>
							<div
								className='absolute top-1 right-1 transform items-center
									justify-center gap-3 group-hover:flex'
							>
								<Icon
									icon={"bx:pencil"}
									width={30}
									className='hover:text-primary'
									onClick={() => {
										open()
										setEditingIndex(i)
									}}
								/>

								<ConfirmDialog
									heading={t("confirmDialog.heading")}
									message={t("confirmDialog.message")}
									onConfirm={() => {
										onChange(
											photos.filter((_, _i) => {
												if (_i === i) {
													URL.revokeObjectURL(photos[i].key)
													return false
												}
												return true
											}),
										)
									}}
								>
									<Icon
										icon={"material-symbols:delete-outline-rounded"}
										width={30}
										className='hover:text-destructive'
									/>
								</ConfirmDialog>
							</div>
						</Card>
					))}
				<Card
					className={`relative aspect-square w-full shrink-0 cursor-pointer
						overflow-hidden p-0`}
				>
					<button
						className={`hover:border-muted-foreground group relative m-auto flex
							aspect-square h-9/10 w-9/10 items-center justify-center
							rounded-[25px] border-4 border-dashed border-black
							active:border-black`}
						{...getRootProps()}
						onClick={open}
						type='button'
					>
						<Icon
							icon={"mdi:plus"}
							width={65}
							className='group-hover:text-muted-foreground
								group-active:text-foreground'
						/>
					</button>
				</Card>
			</div>
			<div
				className='aspect-square w-full max-w-[630px]'
				ref={selectedImageRef}
			>
				<Card className='relative h-full w-full overflow-hidden p-0'>
					{photos?.length && photos[selectedLotIndex] ? (
						<Image
							src={
								photos[selectedLotIndex].key.startsWith("blob:")
									? photos[selectedLotIndex].key
									: getMediaSource(photos[selectedLotIndex].key)
							}
							alt='Product preview'
							fill
							className='object-contain'
						/>
					) : (
						<>
							<UploadPhotoButton
								{...getRootProps()}
								className='m-auto h-9/10 w-9/10 rounded-[25px]'
								onClick={open}
							/>
						</>
					)}
				</Card>
			</div>
			<input className='hidden' {...getInputProps()} />
		</div>
	)
}
