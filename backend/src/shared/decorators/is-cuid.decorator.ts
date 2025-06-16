import { isCuid } from "@paralleldrive/cuid2"
import { registerDecorator, type ValidationOptions } from "class-validator"

export const IsCUID = (validationOptions?: ValidationOptions) => {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "isCUID",
			propertyName: propertyName,
			target: object.constructor,
			options: validationOptions,
			validator: {
				validate(value: any) {
					return typeof value && isCuid(value)
				},
			},
		})
	}
}
