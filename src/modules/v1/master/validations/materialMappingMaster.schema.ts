import Joi from "joi";

/**
 *  Query filter schema (for listing with pagination or filters)
 */
export const materialMappingFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
});

/**
 *  Params schema (used for GET by ID, DELETE by ID, UPDATE by ID)
 */
export const materialMappingParamsSchema = Joi.object({
  id: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid UUID format for MaterialMappingMaster ID",
      "any.required": "MaterialMappingMaster ID is required",
    }),
});

/**
 *  Create schema (POST)
 */
export const createMaterialMappingBodySchema = Joi.object({
  materialMasterId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid UUID format for materialId",
      "any.required": "materialMasterId is required",
    }),

  sourceId: Joi.string()
    .uuid()
    .required()
    .messages({
      "string.guid": "Invalid UUID format for sourceId",
      "any.required": "sourceId is required",
    }),
});

/**
 *  Update schema (PUT)
 */
export const updateMaterialMappingBodySchema = Joi.object({
  materialMasterId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid UUID format for materialId",
    }),

  sourceId: Joi.string()
    .uuid()
    .optional()
    .messages({
      "string.guid": "Invalid UUID format for sourceId",
    }),
}).min(1); // at least one field required
