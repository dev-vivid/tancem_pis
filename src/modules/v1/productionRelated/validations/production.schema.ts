import Joi from "joi";

export const productionFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const productionFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}-\d{2}-\d{4}$/)
		.optional(),
	equipmentId: Joi.string().optional(),
	materialId: Joi.string().optional(),
	runningHours: Joi.string().optional(),
	quantity: Joi.string().optional(),
	fuelConsumption: Joi.string().optional().allow("").allow(null),
	remarks: Joi.string().optional().allow("").allow(null),
});

export const productionCreateFormSchema = Joi.object({
	transactionDate: Joi.string()
		.pattern(/^\d{2}-\d{2}-\d{4}$/)
		.required(),
	equipmentId: Joi.string().required(),
	materialId: Joi.string().required(),
	runningHours: Joi.string().optional(),
	quantity: Joi.string().required(),
	fuelConsumption: Joi.string().optional().allow("").allow(null),
	remarks: Joi.string().optional().allow("").allow(null),
	initiatorRoleId: Joi.string().optional(),
	workflowRemarks: Joi.string().optional(),
	status: Joi.string().optional(),
});
