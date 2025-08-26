import Joi from "joi";

export const equipmentFilterQuerySchema = Joi.object({
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
	status: Joi.string().valid('active' ,'inActive').optional()

});

export const createEquipmentBodySchema = Joi.object({
  equipmentId: Joi.string().max(36).required(),
  equipmentDescription: Joi.string().max(36).required(),
  strength: Joi.string().max(36).required(),
  quality: Joi.string().max(36).required(),
  power: Joi.string().max(36).required(),
  powerGroup: Joi.string().max(36).required(),
  storage: Joi.string().max(36).required(),
  orderOfAppearance: Joi.string().max(36).required(),
});

export const updateEquipmentBodySchema = Joi.object({
  equipmentId: Joi.string().max(36).required(),
  equipmentDescription: Joi.string().max(36).optional(),
  strength: Joi.string().max(36).optional(),
  quality: Joi.string().max(36).optional(),
  power: Joi.string().max(36).optional(),
  powerGroup: Joi.string().max(36).optional(),
  storage: Joi.string().max(36).optional(),
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
