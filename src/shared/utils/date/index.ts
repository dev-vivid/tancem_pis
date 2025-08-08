export function addDays(date: Date, days: number) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

export function convertFromGmt0530ToUtc(isoTimestamp: Date) {
	// Create a Date object from the ISO 8601 timestamp
	const date = new Date(isoTimestamp);

	// Extract the date components
	const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year
	const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
	const day = ("0" + date.getDate()).slice(-2);
	const hours = date.getHours();
	const minutes = ("0" + date.getMinutes()).slice(-2);

	// Convert hours to 12-hour format and determine AM/PM
	const period = hours >= 12 ? "PM" : "AM";
	const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight

	// Construct the custom format string
	const customFormat = `${month}-${day}-${year} ${hours12}:${minutes} ${period}`;

	return customFormat;
}

/**
 * Calculates the start and end dates for a given number of days ago.
 *
 * @param {number} daysAgo - The number of days ago to calculate the dates for.
 * @return {Promise<{ startOfTargetDay: Date, startOfNextDay: Date }>} - An object containing the start of the target day and the start of the next day after the target day.
 */
export async function calculateDateBoundaries(daysAgo: number) {
	const today = new Date();
	const startOfTargetDay = new Date();
	startOfTargetDay.setDate(today.getDate() - daysAgo);
	startOfTargetDay.setHours(0, 0, 0, 0); // Start of the target day

	const startOfNextDay = new Date();
	startOfNextDay.setDate(today.getDate() - daysAgo + 1);
	startOfNextDay.setHours(0, 0, 0, 0); // Start of the next day after the target day

	return {
		startOfTargetDay,
		startOfNextDay,
	};
}

export function extractDateTime(
	isoString: Date | null | undefined,
	type: "date" | "time" | "both" | "year"
) {
	if (!isoString) {
		return "";
	}
	// Create a new Date object from the ISO string
	const date = new Date(isoString);

	// Extract the date parts
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");

	// Extract the time parts
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const seconds = date.getSeconds().toString().padStart(2, "0");

	// Format the date and time
	const formattedDate = `${year}-${month}-${day}`;
	const formattedTime = `${hours}:${minutes}:${seconds}`;

	// Return the appropriate value based on the type
	if (type === "date") {
		return formattedDate;
	} else if (type === "time") {
		return formattedTime;
	} else if (type === "both") {
		return `${formattedDate} ${formattedTime}`;
	} else if (type === "year") {
		return year;
	} else {
		throw new Error(
			'Invalid type provided. Expected "date", "time", or "both".'
		);
	}
}

export function getStartOfYear(year?: number): Date {
	const now = new Date();
	return new Date(year || now.getFullYear(), 0, 1); // January 1st of the current year
}

export function getEndOfYear(year?: number): Date {
	const now = new Date();
	return new Date(year || now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st of the current year
}

export function getCurrentQuarter(date: Date): number {
	return Math.floor(date.getMonth() / 3) + 1;
}
