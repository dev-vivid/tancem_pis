// validations/productionCategory.schema.ts
import Joi from "joi";

export const productionCategoryFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
});

export const createProductionCategoryBodySchema = Joi.object({
  name: Joi.string().max(50).required(),
  productCatagoryCode: Joi.string().required(),
});

export const updateProductionCategoryBodySchema = Joi.object({
  name: Joi.string().max(50).optional(),
  productCatagoryCode: Joi.string().optional(),
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
