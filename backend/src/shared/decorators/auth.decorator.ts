import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common"

import { AUTH_OPTIONS_TOKEN } from "../constants/auth.constants"
import { AuthorizationOptions, GqlAuthGuard } from "../guards/gql-auth.guard"

export const Authorization = (options?: AuthorizationOptions) => {
	return applyDecorators(
		SetMetadata(AUTH_OPTIONS_TOKEN, options),
		UseGuards(GqlAuthGuard),
	)
}
