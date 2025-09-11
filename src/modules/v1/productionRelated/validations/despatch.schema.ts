import Joi from "joi";

export const despatchFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const despatchFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/)
		.required(),
	details: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().optional(),
				materialId: Joi.string().optional(),
				railQuantity: Joi.string().optional(),
				roadQuantity: Joi.string().optional(),
				exportQuantity: Joi.string().optional(),
				inlandQuantity: Joi.string().optional(),
			})
		)
		.required(),
});

export const despatchCreateFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/)
		.required(),
	initiatorRoleId: Joi.string().optional(),
	remarks: Joi.string().optional(),
	status: Joi.string().optional(),
	details: Joi.array()
		.items(
			Joi.object({
				materialId: Joi.string().required(),
				railQuantity: Joi.string().optional(),
				roadQuantity: Joi.string().optional(),
				exportQuantity: Joi.string().optional(),
				inlandQuantity: Joi.string().optional(),
			})
		)
		.required(),
});
