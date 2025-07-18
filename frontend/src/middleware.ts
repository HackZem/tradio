import { NextResponse, NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
	const session = request.cookies.get("session")?.value

	const isAuthPage = request.url.includes("/account")

	if (isAuthPage) {
		if (session) {
			return NextResponse.redirect(new URL("/", request.url))
		}

		return NextResponse.next()
	}

	if (!session) {
		return NextResponse.redirect(new URL("/account/login", request.url))
	}
}

export const config = {
	matcher: ["/account/:path*"],
}
