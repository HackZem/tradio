export function getEnumKey<T extends Record<string, string | number>>(
	enumObject: T,
	enumValue: T[keyof T],
): string {
	return (
		Object.keys(enumObject).find(key => enumObject[key] === enumValue) || ""
	)
}
