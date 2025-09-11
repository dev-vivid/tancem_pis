import Joi from "joi";

// Enum values from Prisma
// const transactionTypeEnum = ["Receipts", "Despatch", "Consume"] as const;

/**
 * Filter (optional pagination or search)
 */
export const adjustmentFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
	search: Joi.string().optional(), // Optional search keyword
});

/**
 * Create Adjustment
 */
export const createAdjustmentBodySchema = Joi.object({
	toSourceId: Joi.string().uuid().optional().messages({
		"string.guid": "Invalid UUID format for toSourceId",
		"string.base": "toSourceId must be a string",
	}),

	quantity: Joi.number().precision(2).positive().required().messages({
		"number.base": "Quantity must be a number",
		"number.positive": "Quantity must be greater than 0",
		"any.required": "Quantity is required",
	}),

	remarks: Joi.string().optional().allow("").messages({
		"string.base": "Remarks must be a string",
	}),

	transactionDate: Joi.string()
		.pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/)
		.required(),

	materialId: Joi.string().uuid().optional().messages({
		"string.guid": "Invalid UUID format for materialId",
		"string.base": "materialId must be a string",
	}),

	transactionTypeId: Joi.string().required().messages({
		"string.guid": "Invalid UUID format for transactionTypeId",
		"string.base": "transactionTypeId must be a string",
		"any.required": "Transaction Type ID is required",
	}),

	initiatorRoleId: Joi.string().optional(),
	workflowRemarks: Joi.string().optional(),
	status: Joi.string().optional(),
});

/**
 * Update Adjustment
 */
export const updateAdjustmentBodySchema = Joi.object({
	toSourceId: Joi.string().uuid().optional().messages({
		"string.guid": "Invalid UUID format for toSourceId",
		"string.base": "toSourceId must be a string",
	}),

	quantity: Joi.number().precision(2).positive().optional().messages({
		"number.base": "Quantity must be a number",
		"number.positive": "Quantity must be greater than 0",
	}),

	remarks: Joi.string().optional().allow("").messages({
		"string.base": "Remarks must be a string",
	}),

	transactionDate: Joi.date().optional().messages({
		"date.base": "Transaction date must be a valid date",
	}),

	materialId: Joi.string().uuid().optional().messages({
		"string.guid": "Invalid UUID format for materialId",
		"string.base": "materialId must be a string",
	}),

	// transactionTypeId: Joi.string()
	//   .uuid()
	//   .optional()
	//   .messages({
	//     "string.guid": "Invalid UUID format for transactionTypeId",
	//     "string.base": "transactionTypeId must be a string",
	//   }),

	transactionTypeId: Joi.string().optional().messages({
		"string.guid": "Invalid UUID format for transactionTypeId",
		"string.base": "transactionTypeId must be a string",
		"any.required": "Transaction Type ID is required",
	}),
}).min(1); // At least one field required

/**
 * Params for get/update/delete
 */
export const adjustmentParamsSchema = Joi.object({
	id: Joi.string().uuid().required().messages({
		"string.guid": "Invalid UUID format for ID",
		"string.base": "ID must be a string",
		"any.required": "ID is required",
	}),
});
