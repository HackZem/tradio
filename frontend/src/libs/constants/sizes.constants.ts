export const SIZES = {
	SM: 640,
	MD: 768,
	LG: 1024,
	XL: 1280,
	XL2: 1536,
	XL3: 1920,
	XL4: 2560,
} as const

export type SizeKey = keyof typeof SIZES
export type SizeValue = (typeof SIZES)[SizeKey]
