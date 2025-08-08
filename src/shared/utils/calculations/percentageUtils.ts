/**
 * Calculates the percentage of objects in an array
 * that match a specific key-value condition.
 *
 * @param data - The array of objects to process
 * @param key - The key in the object to match
 * @param value - The value to match against the key
 * @returns Percentage of matching objects (0-100)
 */
export function getPercentageByKeyValue<T>(
	data: T[],
	key: keyof T,
	value: any
): number {
	if (!Array.isArray(data) || data.length === 0) return 0;

	const matchedCount = data.filter((item) => item[key] == value).length;
	return (matchedCount / data.length) * 100;
}
