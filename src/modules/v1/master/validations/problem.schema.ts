import Joi from "joi";

export const problemFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
	status: Joi.string().valid("active", "inActive").optional(),
});

export const createProblemBodySchema = Joi.object({
  name: Joi.string().optional(),
  plantDepartmentId: Joi.string().required(),
  problemDescription: Joi.string().required(),
  description: Joi.string().optional(),
});

export const updateProblemBodySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  plantDepartmentId: Joi.string().optional(),
  problemDescription: Joi.string().required(),
	status: Joi.string().valid("active", "inActive").optional()
}).min(1);

export const updateProblemParamsSchema = Joi.object({
  id: Joi.string().required(), 
});

export const deleteProblemParamsSchema = Joi.object({
  id: Joi.string().required(), 
});

export const getProblemParamsSchema = Joi.object({
  id: Joi.string().required(), 
});
