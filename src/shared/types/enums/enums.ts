export enum EmployeeTypeEnum {
	EMPLOYEE = "EMPLOYEE",
	TRAINEE = "TRAINEE",
	DEPUTATION = "DEPUTATION",
	CONTRACT = "CONTRACT",
}

export enum EmployeeOnboardingStatusEnum {
	NOT_INITIATED = "NOT_INITIATED",
	INITIATED = "INITIATED",
	UNDER_VERIFICATION = "UNDER_VERIFICATION",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

export enum EmployeeProbationStatusEnum {
	Ongoing = "Ongoing",
	Regularized = "Regularized",
	Dismissed = "Dismissed",
	Extended = "Extended",
}

export enum EmployeeLeaveRequestStatusEnum {
	INITIATED = "INITIATED",
	UNDER_VERIFICATION = "UNDER_VERIFICATION",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

export enum EmployeeOnboardingFormStatusEnum {
	Not_Started = "Not_Started",
	In_Progress = "In_Progress",
	Completed = "Completed",
}

export enum EmployeeOnboardingFormTypeEnum {
	Personal_Details = "Personal_Details",
	Family_Details = "Family_Details",
	Medical_Info = "Medical_Info",
	Passport_Info = "Passport_Info",
	Training_Info = "Training_Info",
	Work_Experience = "Work_Experience",
	Education_Info = "Education_Info",
	Skill_Info = "Skill_Info",
}

export enum EmployeeOperationTypeEnum {
	Major = "Major",
	Minor = "Minor",
}
