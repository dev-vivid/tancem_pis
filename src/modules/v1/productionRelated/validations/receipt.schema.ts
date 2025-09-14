import Joi from "joi";

export const receiptFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const receiptFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/)
		.optional(),
	quantity: Joi.string().optional(),
	materialId: Joi.string().optional(),
	materialType: Joi.string().optional(),
	transactionType: Joi.string().optional(),
});

export const receiptCreateFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}-\d{2}-\d{4}$/) // DD-MM-YYYY
		.required(),
	receiptDetails: Joi.array()
		.items(
			Joi.object({
				quantity: Joi.string()
					.pattern(/^\d{1,8}(\.\d{1,2})?$/) // up to 10 digits total, 2 decimals
					.required(),
				materialId: Joi.string().uuid().required(),
				materialType: Joi.string().uuid().required(),
				transactionType: Joi.string().uuid().required(),
			})
		)
		.min(1)
		.required(),
});
