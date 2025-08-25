import Joi from "joi";

export const problemCodeFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
	status: Joi.string().valid("active", "inActive").optional()
});

export const problemCodeFormSchema = Joi.object({
	problemId: Joi.string().required(),
	equipmentId: Joi.string().required(),
	departmentId: Joi.string().required(),
});


export const updateproblemCodeFormSchema = Joi.object({
	problemId: Joi.string().optional(),
	equipmentId: Joi.string().optional(),
	departmentId: Joi.string().optional(),
	status: Joi.string().valid("active", "inActive").optional()
});
