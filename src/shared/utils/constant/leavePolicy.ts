export const LEAVE_POLICY = {
	CASUAL_LEAVE: {
		annualLeave: 15,
		maxContinuousDays: {
			officer: 10,
			staff: 5,
			worker: 5,
		},
		restrictions: {
			halfDayNotAllowedFor: [],
		},
		carryForward: false,
	},

	EARNED_LEAVE: {
		accrualRate: {
			officer: 1 / 11, // 1 day per 11 working days
			worker: 1 / 20, // 1 day per 20 working days
		},
		accumulationLimit: {
			staff: 180,
			officer: 240,
			worker: 30,
		},
	},

	MEDICAL_LEAVE: {
		annualLeave: 18,
		accumulationLimit: 540, // 30 years max accumulation
		restrictions: {
			halfDayNotAllowedFor: ["worker"],
		},
	},

	MATERNITY_LEAVE: {
		annualLeave: 365,
		maxChildrenAllowed: 2,
	},

	UNPAID_EMERGENCY_LEAVE: {
		annualLeave: {
			first10Years: 45,
			after10Years: 90,
		},
	},

	SURRENDER_LEAVE: {
		convertToCash: {
			staff: 15,
			worker: 18,
		},
		minBalanceRequired: 30, // Must have 30+ days to convert
	},

	JOINING_AVAIL_LEAVE: {
		annualLeave: 7,
		canBeAddedToEarnedLeave: true,
		integrationDetails: "Unused joining leave is added to earned leave balance",
	},

	COMPENSATION_LEAVE: {
		basedOnOvertime: true,
		approvalRequired: true,
	},

	ACCIDENT_BENEFIT_LEAVE: {
		entitlement: "Paid leave during recovery from work-related accidents",
		verificationRequired: true,
	},

	FESTIVAL_LEAVE: {
		entitlement: "Double pay for working on holidays",
		integratedWithPayroll: true,
	},

	WEEK_OFF: {
		manualAdjustmentsAllowed: true,
		exemptFromLeaveDeductions: true,
	},
};
