import Joi from 'joi';

export const stoppageFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional().pattern(/^[0-9]+$/),
	pageSize: Joi.string().optional().pattern(/^[0-9]+$/)
});

export const createStoppageBodySchema = Joi.object({
  transactionDate: Joi.date().required(),
  departmentId: Joi.string().required(),
  equipmentMainId: Joi.string().required(),
  equipmentSubGroupId: Joi.string().required(),
  problems: Joi.array()
    .items(
      Joi.object({
        problemHours: Joi.string()
          .pattern(/^\d{2}:\d{2}$/) // enforce HH:MM format
          .required()
          .messages({
            "string.pattern.base":
              "problemHours must be in HH:MM format (e.g., 02:30)",
          }),
				noOfStoppages: Joi.number().optional(),
        problemId: Joi.string().required(),
        remarks: Joi.string().optional(),
      })
    )
    .required(),
});

export const updateStoppageBodySchema = Joi.object({
  transactionDate: Joi.date().optional(),
  departmentId: Joi.string().optional(),
  equipmentMainId: Joi.string().optional(),
  equipmentSubGroupId: Joi.string().optional(),
  problems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        problemHours: Joi.string()
          .pattern(/^\d{2}:\d{2}$/) // enforce HH:MM format
          .optional()
          .messages({
            "string.pattern.base":
              "problemHours must be in HH:MM format (e.g., 02:30)",
          }),
				noOfStoppages: Joi.number().optional(),
        problemId: Joi.string().optional(),
        remarks: Joi.string().optional(),
      })
    )
    .optional(),
});

export const updateStoppageParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const deleteStoppageParamsSchema = Joi.object({
	id: Joi.string().required(),
});

export const getStoppageParamsSchema = Joi.object({
	id: Joi.string().required(),
});

