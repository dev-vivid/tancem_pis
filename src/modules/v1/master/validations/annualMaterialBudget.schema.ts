import Joi from "joi";

export const annualMaterialBudgetFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
	status: Joi.string().optional()
});

export const createAnnualMaterialBudgetBodySchema = Joi.object({
	financialYear: Joi.string().required(),
	month: Joi.number().integer().required(),
	year: Joi.number().integer().required(),
	materialId: Joi.string().required(),
	value: Joi.number().precision(2).required(),
	
});

export const updateAnnualMaterialBudgetBodySchema = Joi.object({
	financialYear: Joi.string().optional(),
	month: Joi.number().integer().optional(),
	year: Joi.number().integer().optional(),
	materialId: Joi.string().optional(),
	value: Joi.number().precision(2).optional(),
}).min(1);

export const updateAnnualMaterialBudgetParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const deleteAnnualMaterialBudgetParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const getAnnualMaterialBudgetParamsSchema = Joi.object({
	id: Joi.string().required(),
});
