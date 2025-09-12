import Joi from "joi";

export const powerFilterQuerySchema = Joi.object({
	pageNumber: Joi.string()
		.optional()
		.pattern(/^[0-9]+$/),
	pageSize: Joi.string()
		.optional()
		.pattern(/^[0-9]+$/),
});

export const createPowerTransactionBodySchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/)
		.required(),
	powerDetails: Joi.array()
		.items(
			Joi.object({
				equipmentId: Joi.string().required(),
				units: Joi.number().precision(2).required(),
			})
		)
		.min(1)
		.required(),
	initiatorRoleId: Joi.string().optional(),
	remarks: Joi.string().optional(),
	status: Joi.string().optional(),
});

export const updatePowerTransactionBodySchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/)
		.optional(),
	powerDetails: Joi.array()
		.items(
			Joi.object({
				id: Joi.string().optional(),
				equipmentId: Joi.string().optional(),
				units: Joi.number().precision(2).optional(),
			}).min(1)
		)
		.optional(),
}).min(1);

export const updatePowerTransactionParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const deletePowerTransactionParamsSchema = Joi.object({
	powerid: Joi.string().required(),
});

export const getPowerTransactionParamsSchema = Joi.object({
	id: Joi.string().required(),
});
