export enum SalutationEnum {
	Mr = "Mr",
	Mrs = "Mrs",
	Miss = "Miss",
	Ms = "Ms",
	Dr = "Dr",
	Prof = "Prof",
	Rev = "Rev",
	Sir = "Sir",
	Madam = "Madam",
}

export enum MaritalStatusEnum {
	SINGLE = "SINGLE",
	MARRIED = "MARRIED",
	DIVORCED = "DIVORCED",
	WIDOWED = "WIDOWED",
	SEPARATED = "SEPARATED",
	ENGAGED = "ENGAGED",
	UNSPECIFIED = "UNSPECIFIED",
}

export enum GenderEnum {
	MALE = "MALE",
	FEMALE = "FEMALE",
	OTHER = "OTHER",
}

export enum UserStatusEnum {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE",
	SUSPENDED = "SUSPENDED",
	PENDING_VERIFICATION = "PENDING VERIFICATION",
	DELETED = "DELETED",
}

export enum AddressTypeEnum {
	CURRENT = "CURRENT",
	PERMANENT = "PERMANENT",
}

export enum BloodGroupEnum {
	"A+" = "A+", //A_POS
	"A-" = "A-", //A_NEG
	"A1+" = "A1+", //A1_POS
	"A1-" = "A1-", //A1_NEG
	"A1B+" = "A1B+", //A1B_POS
	"A1B-" = "A1B-", //A1B_NEG
	"A2+" = "A2+", //A2_POS
	"A2-" = "A2-", //A2_NEG
	"A2B+" = "A2B+", //A2B_POS
	"A2B-" = "A2B-", //A2B_NEG
	"B+" = "B+", //B_POS
	"B-" = "B-", //B_NEG
	"B1+" = "B1+", //B1_POS
	"B1-" = "B1-", //B1_NEG
	"B2+" = "B2+", //B2_POS
	"B2-" = "B2-", //B2_NEG
	"AB+" = "AB+", //AB_POS
	"AB-" = "AB-", //AB_NEG
	"O+" = "O+", //O_POS
	"O-" = "O-", //O_NEG
}

export enum LicenseTypeEnum {
	// Domestic License Categories
	LEARNER = "LEARNER", // Learner’s License
	MOTORCYCLE = "MOTORCYCLE", // Motorcycle License
	LMV = "LMV", // Light Motor Vehicle (Car)
	HMV = "HMV", // Heavy Motor Vehicle (Truck, Bus)
	COMMERCIAL = "COMMERCIAL", // Commercial Vehicle License
	TAXI = "TAXI", // Taxi/Passenger Vehicle License
	TRACTOR = "TRACTOR", // Tractor License
	FORKLIFT = "FORKLIFT", // Forklift License
	HEAVY_EQUIPMENT = "HEAVY_EQUIPMENT", // Heavy Equipment Operator License
}
