"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/common/Button"
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Form,
	FormMessage,
} from "@/components/ui/common/Form"
import { Input } from "@/components/ui/common/Input"

import { useLoginUserMutation } from "@/graphql/generated/output"

import { useAuth } from "@/hooks/useAuth"

import { AuthWrapper } from "../AuthWrapper"

import loginSchema, { TLoginSchema } from "@/schemas/auth/login-schema"

export function LoginForm() {
	const t = useTranslations("auth.login")

	const { auth } = useAuth()

	const router = useRouter()

	const form = useForm<TLoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			login: "",
			password: "",
		},
	})

	const [login, { loading: isLoadingLogin, data: loginData }] =
		useLoginUserMutation({
			onCompleted() {
				auth()
				router.replace("/")
				toast.success(t("successMessage"))
			},
			onError() {
				toast.error(t("errorMessage"))
			},
		})

	const { isValid, errors } = form.formState

	const onSubmit = (data: TLoginSchema) => {
		login({
			variables: {
				data,
			},
		})
	}

	return (
		<AuthWrapper
			heading={t("heading")}
			backButtonHref='/account/create'
			backButtonLabel={t("backButtonLabel")}
			backLabel={t("backLabel")}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-5'>
					<FormField
						control={form.control}
						name='login'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xl'>{t("loginLabel")}</FormLabel>
								<FormControl>
									<Input {...field} disabled={isLoadingLogin}></Input>
								</FormControl>
								<FormMessage>{errors.login?.message}</FormMessage>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xl'>{t("passwordLabel")}</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										disabled={isLoadingLogin}
									></Input>
								</FormControl>
								<FormMessage>{errors.password?.message}</FormMessage>
							</FormItem>
						)}
					/>
					<Button
						className='rounded-full'
						variant='default'
						disabled={!isValid || isLoadingLogin || !!loginData}
					>
						{t("submitButton")}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
