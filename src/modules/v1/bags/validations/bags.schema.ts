import Joi from "joi";

export const bagsFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const createBagsBodySchema = Joi.object({
	transactionDate: Joi.string().pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/).required(),
	materialId: Joi.string().required(),
	opc: Joi.number().integer().required(),
	ppc: Joi.number().integer().required(),
	src: Joi.number().integer().required(),
	burstopc: Joi.number().integer().required(),
	burstppc: Joi.number().integer().required(),
	burstsrc: Joi.number().integer().required(),
	export: Joi.number().integer().required(),
	deport: Joi.number().integer().required(),
	transferQty: Joi.number().integer().required(),
});

export const updateBagsBodySchema = Joi.object({
	transactionDate: Joi.string().pattern(/^\d{2}[-/]\d{2}[-/]\d{4}$/).optional(),
	materialId: Joi.string().optional(),
	opc: Joi.number().integer().optional(),
	ppc: Joi.number().integer().optional(),
	src: Joi.number().integer().optional(),
	burstopc: Joi.number().integer().optional(),
	burstppc: Joi.number().integer().optional(),
	burstsrc: Joi.number().integer().optional(),
	export: Joi.number().integer().optional(),
	deport: Joi.number().integer().optional(),
	transferQty: Joi.number().integer().optional(),
}).min(1);

export const updateBagsParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const deleteBagsParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const getBagsParamsSchema = Joi.object({
	id: Joi.string().required(),
});
