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

import { useCreateUserMutation } from "@/graphql/generated/output"

import { AuthWrapper } from "../AuthWrapper"

import createAccountSchema, {
	TCreateAccountSchema,
} from "@/schemas/auth/create-account.schema"

export function CreateAccountForm() {
	const t = useTranslations("auth.register")

	const router = useRouter()

	const form = useForm<TCreateAccountSchema>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	const [create, { loading: isLoadingCreate, data: createData }] =
		useCreateUserMutation({
			onCompleted() {
				router.push("/account/verify")
			},
			onError() {
				toast.error(t("errorMessage"))
			},
		})

	const { isValid } = form.formState

	const onSubmit = (data: TCreateAccountSchema) => {
		create({
			variables: {
				data,
			},
		})
	}

	return (
		<AuthWrapper
			heading={t("heading")}
			backButtonHref='/account/login'
			backButtonLabel={t("backButtonLabel")}
			backLabel={t("backLabel")}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-y-5'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xl'>{t("usernameLabel")}</FormLabel>
								<FormControl>
									<Input {...field} disabled={isLoadingCreate}></Input>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xl'>{t("emailLabel")}</FormLabel>
								<FormControl>
									<Input {...field} disabled={isLoadingCreate}></Input>
								</FormControl>
								<FormMessage />
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
										disabled={isLoadingCreate}
									></Input>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-xl'>
									{t("confirmPasswordLabel")}
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										disabled={isLoadingCreate}
									></Input>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className='rounded-full'
						variant='default'
						disabled={!isValid || isLoadingCreate || !!createData}
					>
						{t("submitButton")}
					</Button>
				</form>
			</Form>
		</AuthWrapper>
	)
}
