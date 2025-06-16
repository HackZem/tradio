import { MailerService } from "@nestjs-modules/mailer"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { render } from "@react-email/components"

import { VerificationTemplate } from "./templates/verification.template"

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService,
	) {}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html,
		})
	}

	public async sendVerificationToken(
		email: string,
		username: string,
		token: string,
	) {
		const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN")
		const html = await render(VerificationTemplate({ domain, token, username }))

		return this.sendMail(email, "Verify your email", html)
	}
}
