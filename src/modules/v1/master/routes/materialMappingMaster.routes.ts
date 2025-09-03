// src/modules/v1/master/routes/materialMappingMaster.routes.ts

import { Router } from "express";
import * as materialMappingMasterController from "../controllers/materialMappingMaster.controller";
import {
  createMaterialMappingBodySchema,
  updateMaterialMappingBodySchema,
  materialMappingParamsSchema,
  materialMappingFilterQuerySchema,
} from "../validations/materialMappingMaster.schema";
import { validateRequest } from "@middleware/validateRequest";

const router = Router();

//  Create Material Mapping
router.post(
  "/addMaterialMapping",
  validateRequest(createMaterialMappingBodySchema, "body"),
  materialMappingMasterController.createMaterialMapping
);

//  Get all Material Mappings
router.get(
  "/getmaterialmapAll",
  validateRequest(materialMappingFilterQuerySchema, "query"),
  materialMappingMasterController.getAllMaterialMappings
);

//  Get Material Mapping by ID
router.get(
  "/getMaterialMappingById/:id",
  validateRequest(materialMappingParamsSchema, "params"),
  materialMappingMasterController.getMaterialMappingById
);

// Update Material Mapping
router.put(
  "/updateMaterialMapping/:id",
  validateRequest(updateMaterialMappingBodySchema, "body"),
  validateRequest(materialMappingParamsSchema, "params"),
  materialMappingMasterController.updateMaterialMapping
);

//  Delete Material Mapping
router.patch(
  "/deleteMaterialMapping/:id",
  validateRequest(materialMappingParamsSchema, "params"),
  materialMappingMasterController.deleteMaterialMapping
);

export default router;
