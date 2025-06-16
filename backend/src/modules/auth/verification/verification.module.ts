import { Module } from "@nestjs/common"

import { MailService } from "../../libs/mail/mail.service"

import { VerificationResolver } from "./verification.resolver"
import { VerificationService } from "./verification.service"

@Module({
	providers: [VerificationResolver, VerificationService],
})
export class VerificationModule {}
