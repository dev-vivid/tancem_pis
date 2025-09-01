import Joi from "joi";

export const equipmentFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
	status: Joi.string().valid('active' ,'inActive').optional()

});

export const createEquipmentBodySchema = Joi.object({
  equipmentId: Joi.string().max(36).required(),
  equipmentDescription: Joi.string().max(36).required(),
  strength: Joi.string().valid('Yes' ,'No').required(),
	analysis: Joi.string().valid('Yes' ,'No').required(),
  quality: Joi.string().valid('Yes' ,'No').required(),
  power: Joi.string().valid('Yes' ,'No').required(),
  powerGroup: Joi.string().max(36).required(),
  storage: Joi.string().valid('Yes' ,'No').required(),
  orderOfAppearance: Joi.string().max(36).required(),
});

export const updateEquipmentBodySchema = Joi.object({
  equipmentId: Joi.string().max(36).required(),
  equipmentDescription: Joi.string().max(36).optional(),
  strength:Joi.string().valid('Yes' ,'No').optional(),
	analysis: Joi.string().valid('Yes' ,'No').optional(),
  quality:Joi.string().valid('Yes' ,'No').optional(),
  power: Joi.string().valid('Yes' ,'No').optional(),
  powerGroup: Joi.string().max(36).optional(),
  storage: Joi.string().valid('Yes' ,'No').optional(),
  orderOfAppearance: Joi.string().max(36).optional(),
	status: Joi.string().valid('active' ,'inActive').optional()

}).min(1);

export const updateEquipmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export const deleteEquipmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});

export const getEquipmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required()
});
