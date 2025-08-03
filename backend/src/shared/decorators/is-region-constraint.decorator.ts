import {
	type ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface,
} from "class-validator"
import { State } from "country-state-city"
import * as countries from "i18n-iso-countries"

import { ChangeProfileInfoInput } from "@/src/modules/auth/profile/inputs/change-prifile-info.input"

@ValidatorConstraint({ name: "isRegionExists", async: false })
export class IsRegionExistsConstraint implements ValidatorConstraintInterface {
	validate(
		region: string,
		args: ValidationArguments & {
			constraints?: [{ isCountryOptional: boolean }]
		},
	) {
		const object = args.object as ChangeProfileInfoInput

		const isCountryOptional = args.constraints?.[0]?.isCountryOptional

		if (!object.country && !isCountryOptional) return false
		if (!region) return false

		const regions = State.getStatesOfCountry(object.country ?? "")

		if (!regions || regions.length === 0) return false

		return regions.some(({ isoCode }) => isoCode === region)
	}
	defaultMessage(args: ValidationArguments) {
		const object = args.object as ChangeProfileInfoInput
		return `region "${args.value}" not exists in country "${countries.getName(object.country ?? "", "en")}"`
	}
}
