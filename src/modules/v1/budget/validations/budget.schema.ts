import Joi from "joi";

export const budgetFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const createBudgetBodySchema = Joi.object({
	financialYear: Joi.string().required(),
	transactionDate: Joi.date().required(),
	materialId: Joi.string().required(),
	budgetCode: Joi.string().required(),
	budgetValue: Joi.number().required(),
});

export const updateBudgetBodySchema = Joi.object({
	financialYear: Joi.string().optional(),
	transactionDate: Joi.date().optional(),
	materialId: Joi.string().optional(),
	budgetCode: Joi.string().optional(),
	budgetValue: Joi.number().optional(),
}).min(1);

export const updateBudgetParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const deleteBudgetParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const getBudgetParamsSchema = Joi.object({
	id: Joi.string().required(),
});
