import Joi from "joi";

export const materialTypeFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional().pattern(/^[0-9]+$/),
	pageSize: Joi.string().optional().pattern(/^[0-9]+$/),
	status: Joi.string().valid("active", "inActive").optional(),
});

export const createMaterialTypeBodySchema = Joi.object({
	materialId: Joi.string().required(),
	materialTypeMasterId: Joi.string().required(),
});

export const updateMaterialTypeBodySchema = Joi.object({
	materialId: Joi.string().optional(),
	materialTypeMasterId: Joi.string().optional(),
	status: Joi.string().valid("active", "inActive").optional()
}).min(1);

export const updateMaterialTypeParamsSchema = Joi.object({
	id: Joi.string().required(), 
});

export const deleteMaterialTypeParamsSchema = Joi.object({
	id: Joi.string().required(), 
});

export const getMaterialTypeParamsSchema = Joi.object({
	id: Joi.string().required(), 
});
