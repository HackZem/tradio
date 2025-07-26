import { HeaderMenu } from "./HeaderMenu"
import { Logo } from "./Logo"
import { Navigation } from "./navigation/Navigation"

export function Header() {
	return (
		<header className='bg-card relative flex h-[75px] items-center gap-x-4 px-7.5'>
			<Logo />
			<Navigation />
			<HeaderMenu />
			<hr className='absolute inset-x-2.5 bottom-0 h-px bg-gray-400' />
		</header>
	)
}
