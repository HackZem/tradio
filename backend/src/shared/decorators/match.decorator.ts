import {
	registerDecorator,
	type ValidationArguments,
	type ValidationOptions,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator"

export function Match(property: string, validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [property],
			validator: MatchConstraint,
		})
	}
}

@ValidatorConstraint({ name: "Match", async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		const [relatedPropertyName] = args.constraints
		const relatedValue = (args.object as any)[relatedPropertyName]
		return value === relatedValue
	}
}
