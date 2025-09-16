import Joi from "joi";

export const productionFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const productionFormSchema = Joi.object({
	transactionDate: Joi.string().optional(),
	equipmentId: Joi.string().optional(),
	materialId: Joi.string().optional(),
	runningHours: Joi.string().optional(),
	quantity: Joi.string().optional(),
	fuelConsumption: Joi.string().optional(),
	remarks: Joi.string().optional(),
});

export const productionCreateFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	equipmentId: Joi.string().required(),
	materialId: Joi.string().required(),
	runningHours: Joi.string().required(),
	quantity: Joi.string().required(),
	fuelConsumption: Joi.string().optional(),
	remarks: Joi.string().optional(),
	initiatorRoleId: Joi.string().optional(),
	workflowRemarks: Joi.string().optional(),
	status: Joi.string().optional(),
});
