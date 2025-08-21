import Joi from "joi";

export const receiptFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const receiptFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	quantity: Joi.string().required(),
	materialId: Joi.string().required(),
	materialType: Joi.string().required(),
	transactionType: Joi.string().required(),
});
