import { useEffect, useState } from "react"

import { SIZES } from "@/libs/constants/sizes.constants"

export function useItemsPerSlide() {
	const [itemsPerSlide, setItemsPerSlide] = useState(5)

	useEffect(() => {
		function update() {
			if (window.innerWidth >= SIZES.XL2) setItemsPerSlide(5)
			else if (window.innerWidth >= SIZES.XL) setItemsPerSlide(4)
			else if (window.innerWidth >= SIZES.LG) setItemsPerSlide(3)
			else setItemsPerSlide(2)
		}
		update()
		window.addEventListener("resize", update)
		return () => window.removeEventListener("resize", update)
	}, [])

	return itemsPerSlide
}
