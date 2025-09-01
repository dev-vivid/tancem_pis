import Joi from "joi";

/**
 * Enum values (Yes/No) as per Prisma
 */
const yesNoEnum = ["Yes", "No"] as const;

/**
 * Filter (optional pagination or search)
 */
export const materialFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
  status:Joi.string().valid('active','inActive').optional(),
  search: Joi.string().optional(), // optional search keyword
});

/**
 * Create Material
 */
export const createMaterialBodySchema = Joi.object({




  materialTypeId: Joi.string().max(100).required().messages({
    "string.base": "Material Type must be a string",
    "string.max": "Material Type must not exceed 100 characters",
    "any.required": "Material Type is required",
  }),

  materialDescription: Joi.string().max(200).required().messages({
    "string.base": "Description must be a string",
    "string.max": "Description must not exceed 200 characters",
    "any.required": "Description is required",
  }),

  strength: Joi.string()
    .valid(...yesNoEnum)
    .optional()
    .messages({
      "any.only": "Strength must be either Yes or No",
    }),

  analysis: Joi.string()
    .valid("Yes", "No")
    .optional()
    .messages({
      "any.only": "Analysis must be either Yes or No",
    }),

  quality: Joi.string()
    .valid(...yesNoEnum)
    .optional()
    .messages({
      "any.only": "Quality must be either Yes or No",
    }),

  glCode: Joi.string().max(50).optional().messages({
    "string.base": "GL Code must be a string",
    "string.max": "GL Code must not exceed 50 characters",
  }),

  orderOfAppearance: Joi.number().integer().optional().messages({
    "number.base": "Order of Appearance must be a number",
    "number.integer": "Order of Appearance must be an integer",
  }),
});

/**
 * Update Material
 */
export const updateMaterialBodySchema = Joi.object({
  materialType: Joi.string().max(100).optional().messages({
    "string.base": "Material Type must be a string",
    "string.max": "Material Type must not exceed 100 characters",
  }),

  materialDescription: Joi.string().max(200).optional().messages({
    "string.base": "Description must be a string",
    "string.max": "Description must not exceed 200 characters",
  }),

  strength: Joi.string()
    .valid(...yesNoEnum)
    .optional()
    .messages({
      "any.only": "Strength must be either Yes or No",
    }),

  analysis: Joi.string()
    .valid(...yesNoEnum)
    .optional()
    .messages({
      "any.only": "Analysis must be either Yes or No",
    }),

  quality: Joi.string()
    .valid(...yesNoEnum)
    .optional()
    .messages({
      "any.only": "Quality must be either Yes or No",
    }),

  glCode: Joi.string().max(50).optional().messages({
    "string.base": "GL Code must be a string",
    "string.max": "GL Code must not exceed 50 characters",
  }),


status:Joi.string().valid('active','inActive').optional(),



orderOfAppearance: Joi.number().integer().optional().messages({
    "number.base": "Order of Appearance must be a number",
    "number.integer": "Order of Appearance must be an integer",
  }),
}).min(1); // At least one field required

/**
 * Params for get/update/delete
 */
export const materialParamsSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Invalid UUID format for ID",
    "string.base": "ID must be a string",
    "any.required": "ID is required",
  }),
});
