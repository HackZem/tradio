import {
	type ArgumentMetadata,
	BadRequestException,
	Injectable,
	type PipeTransform,
} from "@nestjs/common"
import { ReadStream } from "fs"

import { validateFileFormat, validateFileSize } from "../utils/file.util"

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) {
			throw new BadRequestException("The file is not loaded")
		}

		const { filename, createReadStream } = value

		const fileStream = createReadStream() as ReadStream

		const allowedFormats = ["jpg", "jpeg", "png", "webp", "gif"]
		const isFileFormatValid = validateFileFormat(filename, allowedFormats)

		if (!isFileFormatValid) {
			throw new BadRequestException("This file format is not allowed")
		}

		const isFileSizeValid = await validateFileSize(fileStream, 10 * 1024 * 1024)

		if (!isFileSizeValid) {
			throw new BadRequestException("This file is larger than 10 MB")
		}

		return value
	}
}
