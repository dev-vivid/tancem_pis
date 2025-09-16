import Joi from "joi";

export const analysisLabFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const analysisLabFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}-\d{2}-\d{4}$/)
		.required(),
	materialId: Joi.string().required(),
	analysisValues: Joi.array()
		.items(
			Joi.object({
				analysisId: Joi.string().required(),
				value: Joi.number().precision(4).allow(null),
			})
		)
		.min(1)
		.required(),
});

export const updateAnalysisLabSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}-\d{2}-\d{4}$/)
		.optional(),
	materialId: Joi.string().optional(),
	analysisValues: Joi.array()
		.items(
			Joi.object({
				analysisId: Joi.string().required(),
				value: Joi.number().precision(4).allow(null),
			})
		)
		.optional(),
});
