export function sanitizeBigInt(obj: any) {
	return JSON.parse(
		JSON.stringify(obj, (_key, value) =>
			typeof value === "bigint" ? Number(value) : value
		)
	);
}
