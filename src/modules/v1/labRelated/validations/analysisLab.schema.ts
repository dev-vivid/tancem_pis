import Joi from "joi";

export const analysisLabFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const analysisLabFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	materialId: Joi.string().required(),
	analysisId: Joi.array().items(Joi.string()).min(1).required(), // expects ["id1", "id2"]
});
