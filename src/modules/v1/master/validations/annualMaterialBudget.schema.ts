import Joi from "joi";

export const annualMaterialBudgetFilterQuerySchema = Joi.object({
	pageNumber: Joi.string()
		.optional()
		.pattern(/^[0-9]+$/),
	pageSize: Joi.string()
		.optional()
		.pattern(/^[0-9]+$/),
	status: Joi.string().valid("active", "inActive").optional(),
});

export const createAnnualMaterialBudgetBodySchema = Joi.object({
	financialYear: Joi.string().required(),
	month: Joi.number().integer().required(),
	year: Joi.number().integer().required(),
	materials: Joi.array()
		.items(
			Joi.object({
				materialId: Joi.string().required(),
				value: Joi.number().precision(2).required(),
			})
		)
		.min(1)
		.required(),
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
