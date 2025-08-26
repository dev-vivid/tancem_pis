// src/modules/subEquipment/validations/subEquipment.schema.ts
import Joi from "joi";

export const subEquipmentFilterQuerySchema = Joi.object({
	status: Joi.string().valid('active' ,'inActive').optional(),
  pageNumber: Joi.string().optional(),
  pageSize: Joi.string().optional(),
});

export const createSubEquipmentBodySchema = Joi.object({
  subEquipmentNo: Joi.string().max(36).required(),
  subEquipmentDescription: Joi.string().max(36).required(),
  equipmentSubGroupId: Joi.string().max(36).required(),
	eq_id: Joi.string().max(36).required()

});

export const updateSubEquipmentBodySchema = Joi.object({
  subEquipmentNo: Joi.string().max(36).optional(),
  subEquipmentDescription: Joi.string().max(36).optional(),
  equipmentSubGroupId: Joi.string().max(36).optional(),
	eq_id: Joi.string().max(36).optional(),
	status: Joi.string().valid('active' ,'inActive').optional()

}).min(1);

export const updateSubEquipmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const deleteSubEquipmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const getSubEquipmentParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
