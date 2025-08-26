import Joi from "joi";

// Query filters
export const materialTypeMasterFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
	status: Joi.string().valid('active' ,'inActive').optional()

});

// Create schema
export const createMaterialTypeMasterBodySchema = Joi.object({
  name: Joi.string().min(1).required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  materialTypeCode: Joi.string().min(1).required().messages({
    "string.empty": "Material Type Code is required",
    "any.required": "Material Type Code is required",
  }),
});

// export const createProductionCategoryBodySchema = Joi.object({
// 	name: Joi.string().max(50).required(),
// 	materialMasterTypeCode: Joi.string().required(),
// });

// Update schema
export const updateMaterialTypeMasterBodySchema = Joi.object({
  name: Joi.string().min(1).optional(),
  materialTypeCode: Joi.string().min(1).optional(),
  isActive: Joi.boolean().optional(),
	status: Joi.string().valid('active' ,'inActive').optional()


}).min(1); // Ensure at least one field is updated

// Params schema for ID
export const getMaterialTypeMasterParamsSchema = Joi.object({
  id: Joi.string().guid({ version: ["uuidv4"] }).required(),
});

export const updateMaterialTypeMasterParamsSchema =
  getMaterialTypeMasterParamsSchema;

export const deleteMaterialTypeMasterParamsSchema =
  getMaterialTypeMasterParamsSchema;
