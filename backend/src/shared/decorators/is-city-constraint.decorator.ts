import {
	type ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator"
import { City } from "country-state-city"
import * as countries from "i18n-iso-countries"

import { ChangeProfileInfoInput } from "@/src/modules/auth/profile/inputs/change-prifile-info.input"

@ValidatorConstraint({ name: "isCityExists", async: false })
export class IsCityExistsConstraint implements ValidatorConstraintInterface {
	validate(
		city: string,
		args: ValidationArguments & {
			constraints: [{ isCountryOptional: boolean }]
		},
	) {
		const object = args.object as ChangeProfileInfoInput

		const isCountryOptional = args.constraints[0].isCountryOptional

		if (!object.country && !isCountryOptional) return false
		if (!city) return false

		const cities = City.getCitiesOfCountry(object.country ?? "")

		if (!cities || cities.length === 0) return false

		return cities.some(c => c.name.toLowerCase() === city.toLowerCase())
	}
	defaultMessage(args: ValidationArguments) {
		const object = args.object as ChangeProfileInfoInput
		return `City "${args.value}" not exists in country "${countries.getName(object.country ?? "", "en")}"`
	}
}
