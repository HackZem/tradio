import { applyDecorators, UseGuards } from "@nestjs/common"

import { WsAuthGuard } from "../guards/ws-auth.guard"

export const WsAuthorization = () => {
	return applyDecorators(UseGuards(WsAuthGuard))
}
