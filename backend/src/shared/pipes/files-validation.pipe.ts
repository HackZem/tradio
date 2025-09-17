import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform,
} from "@nestjs/common"

import { CreateLotInput } from "@/src/modules/lot/inputs/create-lot.input"

import { FileValidationPipe } from "./file-validation.pipe"

@Injectable()
export class FilesValidationPipe implements PipeTransform {
	public constructor(private readonly field?: keyof CreateLotInput) {}

	public async transform(values: any, metadata: ArgumentMetadata) {
		if (this.field) {
			const photos = values[this.field]
			const resolvedPhotos = await Promise.all(
				photos.map(async photo => ({
					...photo,
					file: photo.file ? await photo.file : undefined,
				})),
			)

			if (!resolvedPhotos) {
				throw new BadRequestException("Files are not loaded")
			}

			const fileValidationPipe = new FileValidationPipe()

			for (let photo of resolvedPhotos) {
				if (!photo.file) continue

				await fileValidationPipe.transform(photo.file, metadata)
			}

			return { ...values, [this.field]: resolvedPhotos }
		}

		return values
	}
}
