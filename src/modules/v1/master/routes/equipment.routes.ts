import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
  createEquipmentBodySchema,
  equipmentFilterQuerySchema,
  getEquipmentParamsSchema,
  updateEquipmentBodySchema,
  updateEquipmentParamsSchema,
  deleteEquipmentParamsSchema
} from "../validations/equipment.schema";
import {
  getAllEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} from "../controllers/equipment.controller";

const equipmentRouter = express.Router();

equipmentRouter.get(
  "/equipmentAll",
  validateRequest(equipmentFilterQuerySchema, "query"),
  getAllEquipment
);

equipmentRouter.get(
  "/equipmentById/:id",
  validateRequest(getEquipmentParamsSchema, "params"),
  getEquipmentById
);

equipmentRouter.post(
  "/equipmentAdd",
  validateRequest(createEquipmentBodySchema, "body"),
  createEquipment
);

equipmentRouter.put(
  "/equipmentUpdate/:id",
  validateRequest(updateEquipmentParamsSchema, "params"),
  validateRequest(updateEquipmentBodySchema, "body"),
  updateEquipment
);

equipmentRouter.patch(
  "/deleteEquipment/:id",
  validateRequest(deleteEquipmentParamsSchema, "params"),
  deleteEquipment
);

export default equipmentRouter;
