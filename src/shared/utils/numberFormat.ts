function formatNumberWithComma(number: any) {
	if (typeof number !== "number") return number; // Ensure input is a number
	const [integerPart, decimalPart] = number.toString().split(".");
	const lastThree = integerPart.slice(-3);
	const otherDigits = integerPart.slice(0, -3);
	const formattedNumber = otherDigits
		? otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
		: lastThree;
	return decimalPart ? `${formattedNumber}.${decimalPart}` : formattedNumber;
}

export default formatNumberWithComma;
