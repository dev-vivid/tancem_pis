type DataObject = Record<string, any>;
type KeyMappings = Record<string, string>;
type ComputedKeys = Record<string, string[]>;

/**
 * Extracts specified keys from an object or an array of objects and flattens them.
 *
 * @param data - Object or array of objects to filter
 * @param keys - Array of keys (supports dot notation for nested keys)
 * @param keyMappings - Optional mapping of keys to new names
 * @param computedKeys - Optional computed fields combining multiple keys
 * @returns A new object or array with only the specified keys, flattened
 */
export const extractKeysFromObjects = <T extends Record<string, any>>(
	data: T | T[],
	keys: string[],
	keyMappings: KeyMappings = {},
	computedKeys: ComputedKeys = {}
): Record<string, any> | Record<string, any>[] => {
	// Normalize input to always be an array
	const dataArray = Array.isArray(data) ? data : [data];

	const processItem = (item: T): Record<string, any> => {
		let newItem: Record<string, any> = {};

		// Extract specified keys
		keys.forEach((key) => {
			const keyParts = key.split(".");
			let value: any = item;

			// Traverse nested objects safely
			for (let part of keyParts) {
				if (value && typeof value === "object" && part in value) {
					value = value[part];
				} else {
					value = null; // Ensure missing keys return null
					break;
				}
			}

			// Use mapped key name if provided; otherwise, use last part of key
			const newKey = keyMappings[key] || keyParts[keyParts.length - 1];
			newItem[newKey] = value;
		});

		// Compute values for computed keys dynamically (no hardcoding)
		Object.entries(computedKeys).forEach(([newKey, keyPaths]) => {
			const values = keyPaths.map((path) => {
				const pathParts = path.split(".");
				let value: any = item;

				for (let part of pathParts) {
					if (value && typeof value === "object" && part in value) {
						value = value[part];
					} else {
						value = ""; // Ensure missing computed fields return null
						break;
					}
				}

				return value;
			});

			// If at least one value exists, join them; otherwise, return null
			newItem[newKey] = values.some((val) => val !== null && val !== undefined)
				? values.filter(Boolean).join(" ")
				: null;
		});

		return newItem;
	};

	// Process data array or return single object
	const result = dataArray.map(processItem);
	return Array.isArray(data) ? result : result[0];
};
