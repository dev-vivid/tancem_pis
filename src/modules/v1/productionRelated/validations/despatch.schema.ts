import Joi from "joi";

export const despatchFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const despatchFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	materialId: Joi.string().required(),
	railQuantity: Joi.string().optional(),
	roadQuantity: Joi.string().optional(),
	exportQuantity: Joi.string().optional(),
	inlandQuantity: Joi.string().optional(),
});

export const despatchCreateFormSchema = Joi.array().items(
	Joi.object({
		transactionDate: Joi.string().required(),
		materialId: Joi.string().required(),
		railQuantity: Joi.string().optional(),
		roadQuantity: Joi.string().optional(),
		exportQuantity: Joi.string().optional(),
		inlandQuantity: Joi.string().optional(),
		initiatorRoleId: Joi.string().required(),
		remarks: Joi.string().optional(),
		status: Joi.string().optional(),
	})
);
