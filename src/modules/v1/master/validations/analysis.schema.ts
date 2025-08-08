import Joi from "joi";

export const analysisFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const analysisFormSchema = Joi.object({
	analysisType: Joi.string().required(),
	description: Joi.string().optional(),
});
