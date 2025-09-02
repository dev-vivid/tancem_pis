import Joi from "joi";

export const analysisFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
	status: Joi.string().valid("active", "inActive").optional(),
	materialId: Joi.string().uuid().optional(),
});

export const analysisFormSchema = Joi.object({
	analysisType: Joi.string().required(),
	description: Joi.string().optional(),
	materialId: Joi.string().required(),
});

export const updateanalysisFormSchema = Joi.object({
	analysisType: Joi.string().required(),
	description: Joi.string().optional(),
	materialId: Joi.string().required(),
	status: Joi.string().valid("active", "inActive").optional(),
}).min(1);
