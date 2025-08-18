import Joi from "joi";

// Filter (optional pagination or search if needed)
export const transactionTypeFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
});

// Create
export const createTransactionTypeBodySchema = Joi.object({
  name: Joi.string()
    .max(50)
    .required()
    .messages({
      "string.base": "Transaction Type name must be a string",
      "string.empty": "Transaction Type name is required",
      "string.max": "Transaction Type name must be at most 50 characters",
      "any.required": "Transaction Type name is required"
    }),
});

// Update
export const updateTransactionTypeBodySchema = Joi.object({
  name: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.base": "Transaction Type name must be a string",
      "string.max": "Transaction Type name must be at most 50 characters",
    }),
}).min(1); // at least 1 field required

// Params for update/get/delete
export const transactionTypeParamsSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID is required"
  }),
});
