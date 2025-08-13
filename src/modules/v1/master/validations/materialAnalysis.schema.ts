import Joi from "joi";

export const materialAnalysisFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const createMaterialAnalysisBodySchema = Joi.object({
	analysisId: Joi.string().required(),
	materialId: Joi.string().required(),
});

export const updateMaterialAnalysisBodySchema = Joi.object({
	analysisId: Joi.string().required(),
	materialId: Joi.string().required(),
}).min(1);

export const updateMaterialAnalysisParamsSchema = Joi.object({
	id: Joi.string().required(), 
});

export const deleteMaterialAnalysisParamsSchema = Joi.object({
	id: Joi.string().required(), 
});

export const getMaterialAnalysisParamsSchema = Joi.object({
	id: Joi.string().required(), 
});
