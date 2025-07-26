import { Area } from "react-easy-crop"

export default function getCroppedImg(
	imageSource: string,
	croppedAreaPixels: Area,
): Promise<Blob> {
	const image = new Image()
	image.src = imageSource
	const canvas = document.createElement("canvas")
	const ctx = canvas.getContext("2d")

	canvas.width = croppedAreaPixels.width
	canvas.height = croppedAreaPixels.height

	return new Promise((resolve, reject) => {
		image.onload = () => {
			if (!ctx) {
				return reject(new Error("Could not get canvas context"))
			}

			ctx.drawImage(
				image,
				croppedAreaPixels.x,
				croppedAreaPixels.y,
				croppedAreaPixels.width,
				croppedAreaPixels.height,
				0,
				0,
				croppedAreaPixels.width,
				croppedAreaPixels.height,
			)

			canvas.toBlob(
				blob => {
					if (!blob) return reject(new Error("Canvas is empty"))
					resolve(blob)
				},
				"image/jpeg",
				1,
			)
		}
		image.onerror = err => reject(err)
	})
}
