// validations/productionCategory.schema.ts
import Joi from "joi";

export const productionCategoryFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
	status: Joi.string().valid('active' ,'inActive').optional()
});

export const createProductionCategoryBodySchema = Joi.object({
  name: Joi.string().max(50).required(),
  // categoryName: Joi.string().required(),
});

export const updateProductionCategoryBodySchema = Joi.object({
  name: Joi.string().max(50).optional(),
  // productCatagoryCode: Joi.string().optional(),
	status: Joi.string().valid('active' ,'inActive').optional(),
}).min(1);

export const updateProductionCategoryParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export const deleteProductionCategoryParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export const getProductionCategoryParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});
