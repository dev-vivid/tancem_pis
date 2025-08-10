import Joi from "joi";

export const problemCodeFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const problemCodeFormSchema = Joi.object({
	problemId: Joi.string().required(),
	equipmentId: Joi.string().required(),
	departmentId: Joi.string().required(),
});
