export function convertToBool(
	value?: string | number | boolean,
	defaultOut: boolean = false
) {
	return value
		? ["false", "0", 0, "FALSE", "False", false].includes(value)
			? false
			: true
		: defaultOut;
}
