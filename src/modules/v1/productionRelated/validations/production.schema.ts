import Joi from "joi";

export const productionFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const productionFormSchema = Joi.object({
	transactionDate: Joi.string().required(),
	equipmentId: Joi.string().required(),
	materialId: Joi.string().required(),
	runningHours: Joi.string().required(),
	quantity: Joi.string().required(),
	fuelConsumption: Joi.string().optional(),
	remarks: Joi.string().optional(),
});
