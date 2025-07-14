import { HeaderMenu } from "./HeaderMenu"
import { Logo } from "./Logo"

interface Props {}

export function Header({}: Props) {
	return (
		<header className='bg-card relative flex h-[75px] items-center gap-x-4 px-7.5'>
			<Logo />
			<HeaderMenu />
			<hr className='absolute inset-x-2.5 bottom-0 h-px bg-gray-400' />
		</header>
	)
}
