import { z } from "zod"

import {
	ALLOWED_FILE_FORMATS,
	MAX_FILE_SIZE,
} from "@/libs/constants/image.constants"

const uploadFileSchema = z.object({
	file: z
		.union([
			z
				.instanceof(File)
				.refine(
					file =>
						file.size <= MAX_FILE_SIZE &&
						ALLOWED_FILE_FORMATS.includes(file.type),
				),
			z.string().transform(value => (value === "" ? undefined : value)),
		])
		.optional(),
})

export type TUploadFileSchema = z.infer<typeof uploadFileSchema>

export default uploadFileSchema
