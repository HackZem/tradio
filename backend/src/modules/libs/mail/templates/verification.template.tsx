import { Body, Button, Head, Heading, Link, Preview, Section, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface VerificationTemplateProps {
  domain: string
  token: string
  username: string
}

export function VerificationTemplate({ domain, token, username}: VerificationTemplateProps) {
  const verificationLink = `${domain}/account/verify?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Account verification in Tradio</Preview>
      <Tailwind>
        <Body className="max-w-2xl mx-auto p-6 bg-slate-50">
          <Section className="text-center mb-8">
            <Heading className="text-3xl text-black font-bold">Verify your email</Heading>
            <Text className="text-base text-black">
              Hi {username}, 
              Thank you for registering with Tradio!
              Please confirm your email address to complete your account registration by clicking this button:
            </Text>
            <Button href={verificationLink} className="bg-primary inline-flex 
            justify-center items-center rounded-xl 
            text-xl font-medium text-white px-5 py-2">Confirm Email</Button>
          </Section>

          <Section className="text-center mt-8">
            <Text className="text-black">
              If you have any questions or need assistance, 
              please contact our support team:{" "}
              <Link
                href="mailto:help@tradio.at"
                className="text-primary underline"
              >
                help@tradio.at
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  )
}
