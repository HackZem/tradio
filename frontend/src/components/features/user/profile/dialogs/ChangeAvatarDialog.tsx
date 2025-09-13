"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify-icon/react"
import { useTranslations } from "next-intl"
import {
	ChangeEvent,
	PropsWithChildren,
	useEffect,
	useRef,
	useState,
} from "react"
import { useDropzone } from "react-dropzone"
import Cropper, { Area } from "react-easy-crop"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/common/Button"
import { DialogClose } from "@/components/ui/common/Dialog"
import { Form, FormField } from "@/components/ui/common/Form"
import { UploadPhotoButton } from "@/components/ui/elements/ChangeAvatarButton"
import { ChangeDialog } from "@/components/ui/elements/ChangeDialog"

import { useChangeProfileAvatarMutation } from "@/graphql/generated/output"

import { useCurrent } from "@/hooks/useCurrent"

import {
	ALLOWED_FILE_FORMATS,
	MAX_FILE_SIZE,
} from "@/libs/constants/image.constants"

import getCroppedImg from "@/utils/get-cropped-img"

import uploadFileSchema, {
	TUploadFileSchema,
} from "@/schemas/upload-file.schema"

export function ChangeAvatarDialog({ children }: PropsWithChildren<unknown>) {
	const CROP_SIZE = 300

	const t = useTranslations("user.profile.avatar")

	const { user, isLoadingProfile, refetch } = useCurrent()

	const [imageSource, setImageSource] = useState<string | null>(null)
	const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
	const [zoom, setZoom] = useState<number>(1)
	const [minZoom, setMinZoom] = useState<number>(1)
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

	const [isOpen, setIsOpen] = useState<boolean>(false)

	const form = useForm<TUploadFileSchema>({
		resolver: zodResolver(uploadFileSchema),
		values: {
			file: "",
		},
	})

	const { isSubmitting } = form.formState

	useEffect(() => {
		return () => {
			if (imageSource) URL.revokeObjectURL(imageSource)
		}
	}, [imageSource])

	const { getRootProps, getInputProps, open } = useDropzone({
		onDrop: (files: File[]) => {
			if (files && files.length > 0) {
				const file = files[0]
				imageUpload(file)
			}
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

	const [change, { loading: isLoadingChange }] = useChangeProfileAvatarMutation(
		{
			onCompleted() {
				refetch()
				toast.success(t("successChangedMessage"))
				setIsOpen(false)
				clearDialog()
			},
			onError() {
				toast.error(t("errorChangedMessage"))
			},
		},
	)

	async function imageUpload(file?: File) {
		if (!file) return

		form.clearErrors("file")

		form.setValue("file", file, { shouldValidate: true })

		const isValid = await form.trigger("file")

		if (!isValid) {
			toast.error(t("errorUploadMessage"), {
				description: t("errorUploadDescription"),
			})
			return
		}

		const url = URL.createObjectURL(file)
		setImageSource(url)
	}

	function handleOpenChange(isOpen: boolean) {
		setIsOpen(isOpen)

		if (!isOpen) {
			clearDialog()
		}
	}

	function clearDialog() {
		form.reset()
		setCroppedAreaPixels(null)
		setImageSource(null)
	}

	function onCropComplete(_: Area, croppedPixels: Area) {
		setCroppedAreaPixels(croppedPixels)
	}

	function onMediaLoaded(mediaSize: { width: number; height: number }) {
		const zoomX = CROP_SIZE / mediaSize.width
		const zoomY = CROP_SIZE / mediaSize.height

		const minZoom = Math.max(zoomX, zoomY, 1)

		setMinZoom(minZoom)
		setZoom(minZoom)
	}

	async function onSubmit({ file }: TUploadFileSchema) {
		if (!file) return

		const blob = await getCroppedImg(imageSource!, croppedAreaPixels!)

		URL.revokeObjectURL(imageSource!)

		const avatar = new File(
			[blob],
			typeof file === "string" ? "avatar" : (file?.name ?? "avatar"),
			{ type: blob.type },
		)

		form.setValue("file", avatar)

		change({ variables: { avatar } })
	}

	return (
		!isLoadingProfile &&
		user && (
			<ChangeDialog
				isOpen={isOpen}
				onOpenChange={handleOpenChange}
				trigger={children}
				heading={t("heading")}
			>
				<Form {...form}>
					<FormField
						control={form.control}
						name='file'
						render={_ => (
							<div
								className='relative my-[30px] flex h-full w-full flex-col
									items-center'
							>
								{imageSource ? (
									<>
										<Cropper
											style={{
												containerStyle: {
													height: 300,
													width: "100%",
													position: "relative",
													borderRadius: "25px",
												},
											}}
											cropSize={{ width: CROP_SIZE, height: CROP_SIZE }}
											image={imageSource}
											crop={crop}
											zoom={zoom}
											minZoom={minZoom}
											maxZoom={10}
											zoomSpeed={0.6}
											onMediaLoaded={onMediaLoaded}
											aspect={1}
											cropShape='round'
											showGrid={false}
											onCropChange={setCrop}
											onCropComplete={onCropComplete}
											onZoomChange={setZoom}
										/>
										<Icon
											icon='lets-icons:close-round'
											width='28'
											className='text-destructive absolute top-2.5 right-2.5
												opacity-90 hover:cursor-pointer hover:opacity-100'
											onClick={() => clearDialog()}
										/>
									</>
								) : (
									<>
										<input className='hidden' {...getInputProps()} />
										<UploadPhotoButton
											onClick={open}
											{...getRootProps()}
											className='max-w-[300px] rounded-full'
										/>
									</>
								)}
							</div>
						)}
					/>
					<div className='space-y-[10px]'>
						<Button
							className='w-full max-w-[300px]'
							disabled={
								!form.getValues("file") || isLoadingChange || isSubmitting
							}
							onClick={() => {
								form.handleSubmit(onSubmit)()
							}}
						>
							{form.getValues("file")
								? t("changeAvatarButton")
								: t("chooseAvatar")}
						</Button>
						<DialogClose asChild>
							<Button
								variant={"outline"}
								className='w-full max-w-[300px]'
								disabled={isSubmitting}
								onClick={() => {
									form.reset()
									setImageSource(null)
									setCroppedAreaPixels(null)
								}}
							>
								{t("cancelButton")}
							</Button>
						</DialogClose>
					</div>
				</Form>
			</ChangeDialog>
		)
	)
}
