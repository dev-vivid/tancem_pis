import Joi from "joi";

export const powerFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
});

export const createPowerTransactionBodySchema = Joi.object({
  transactionDate: Joi.date().required(),
  powerDetails: Joi.array()
    .items(
      Joi.object({
        equipmentId: Joi.string().required(),
        units: Joi.number().precision(2).required(),
      })
    )
    .min(1)
    .required(),
});

export const updatePowerTransactionBodySchema = Joi.object({
  transactionDate: Joi.date().optional(),
  powerDetails: Joi.array()
    .items(
      Joi.object({
				id: Joi.string().optional(),
        equipmentId: Joi.string().optional(),
        units: Joi.number().precision(2).optional(),
      }).min(1)
    )
    .optional(),
}).min(1);

export const updatePowerTransactionParamsSchema = Joi.object({
  id: Joi.string().required(),
});

export const deletePowerTransactionParamsSchema = Joi.object({
  id: Joi.string().required(),
});

export const getPowerTransactionParamsSchema = Joi.object({
  id: Joi.string().required(),
});
