import Joi from "joi";

export const qualityLabFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const qualityLabFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	materialId: Joi.string().required(),
	equipmentId: Joi.string().required(),
	ist: Joi.string().optional(),
	fst: Joi.string().optional(),
	blaine: Joi.string().optional(),
});

export const qualityLabUpdateFormSchema = Joi.object({
	transactionDate: Joi.string().optional(),
	materialId: Joi.string().optional(),
	equipmentId: Joi.string().optional(),
	ist: Joi.string().optional(),
	fst: Joi.string().optional(),
	blaine: Joi.string().optional(),
});
