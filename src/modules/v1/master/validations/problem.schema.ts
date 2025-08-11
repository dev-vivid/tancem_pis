import Joi from "joi";

export const problemFilterQuerySchema = Joi.object({
	pageNumber: Joi.string().optional(),
	pageSize: Joi.string().optional(),
});

export const createProblemBodySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  departmentId: Joi.string().required(),
  problem: Joi.string().required(),
});

export const updateProblemBodySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  departmentId: Joi.string().optional(),
  problem: Joi.string().required(),
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
