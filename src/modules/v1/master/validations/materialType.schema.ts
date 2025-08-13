import Joi from "joi";

export const materialTypeFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const createMaterialTypeBodySchema = Joi.object({
	materialId: Joi.string().required(),
	materialTypeMasterId: Joi.string().required(),
});

export const updateMaterialTypeBodySchema = Joi.object({
	materialId: Joi.string().required(),
	materialTypeMasterId: Joi.string().required(),
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
