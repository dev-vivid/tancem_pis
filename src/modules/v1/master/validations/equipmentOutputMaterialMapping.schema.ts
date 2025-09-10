import Joi from "joi";

export const mappingFilterQuerySchema = Joi.object({
	pageNumber: Joi.string()
		.optional()
		.pattern(/^[0-9]+$/),
	pageSize: Joi.string()
		.optional()
		.pattern(/^[0-9]+$/),
	status: Joi.string().valid("active", "inActive").optional(),
});

export const createMappingBodySchema = Joi.object({
	equipmentId: Joi.string().required(),
	materialId: Joi.string().required(),
});

export const updateMappingBodySchema = Joi.object({
	equipmentId: Joi.string().optional(),
	materialId: Joi.string().optional(),
	status: Joi.string().valid("active", "inActive").optional(),
}).min(1);

export const updateMappingParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const deleteMappingParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const getMappingParamsSchema = Joi.object({
	id: Joi.string().required(),
});
