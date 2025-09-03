// src/modules/subEquipment/routes/subEquipment.routes.ts
import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
  createSubEquipmentBodySchema,
  subEquipmentFilterQuerySchema,
  getSubEquipmentParamsSchema,
  updateSubEquipmentBodySchema,
  updateSubEquipmentParamsSchema,
  deleteSubEquipmentParamsSchema
} from "../validations/subEquipment.schema";
import {
	getAllSubEquipmentController as getAllSubEquipment,
  getIdSubEquipmentController as getIdSubEquipment,
  createSubEquipmentController as createSubEquipment,
  updateSubEquipmentController as updateSubEquipment,
  deleteSubEquipmentController as deleteSubEquipment
} from "../controllers/subEquipment.controller";

const subEquipmentRouter = express.Router();

subEquipmentRouter.get(
  "/subEquipmentAll",
  validateRequest(subEquipmentFilterQuerySchema, "query"),
  getAllSubEquipment
);

subEquipmentRouter.get(
  "/subEquipmentById/:id",
  validateRequest(getSubEquipmentParamsSchema, "params"),
  getIdSubEquipment
);

subEquipmentRouter.post(
  "/subEquipmentAdd",
  validateRequest(createSubEquipmentBodySchema, "body"),
  createSubEquipment
);

subEquipmentRouter.put(
  "/subEquipmentUpdate/:id",
  validateRequest(updateSubEquipmentParamsSchema, "params"),
  validateRequest(updateSubEquipmentBodySchema, "body"),
  updateSubEquipment
);

subEquipmentRouter.patch(
  "/deleteSubEquipment/:id",
  validateRequest(deleteSubEquipmentParamsSchema, "params"),
  deleteSubEquipment
);

export default subEquipmentRouter;
