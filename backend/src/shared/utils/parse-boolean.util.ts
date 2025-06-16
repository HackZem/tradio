const FALSE_STRINGS = ["FALSE", "NO", "0"]

/**
 * @hidden
 * @internal
 */
function isString(value: any): value is string {
	return typeof value === "string" || value instanceof String
}

/**
 * @hidden
 * @internal
 */
function isNumber(value: any): value is number {
	return typeof value === "number"
}

/**
 * Converts to a boolean. Returns false if the value is falsy.
 * If it is truthy it checks it by converting to a string, trimming, upcasing, and checking if the value is not `FALSE` or `NO` or `0`.
 *
 * @param x
 */
export function parseBoolean(x: any): boolean {
	if (x === true) return true
	if (!x) return false
	if (!isString(x) && !isNumber(x)) return false

	const str = `${x}`.toUpperCase().trim()
	return !FALSE_STRINGS.includes(str)
}

export default parseBoolean
