// src/modules/v1/master/routes/material.routes.ts

import { Router } from "express";
import * as materialController from "../controllers/material.controller";
import {
	materialFilterQuerySchema,
	materialParamsSchema,
	createMaterialBodySchema,
	updateMaterialBodySchema,
} from "../validations/material.schema";
import { validateRequest } from "@middleware/validateRequest";
import { getAllMaterial } from "../controllers/material.controller";

const router = Router();

// Create Material
router.post(
	"/addMaterial",
	validateRequest(createMaterialBodySchema, "body"),
	materialController.createMaterial
);

// Get all Materials
router.get(
  "/materialAll",
  validateRequest(materialFilterQuerySchema, "query"),materialController.
  getAllMaterial
);

// Get Material by ID
router.get(
	"/getMaterialById/:id",
	validateRequest(materialParamsSchema, "params"),
	materialController.getMaterialById
);

// Update Material
router.put(
	"/updateMaterial/:id",
	validateRequest(updateMaterialBodySchema, "body"),
	validateRequest(materialParamsSchema, "params"),
	materialController.updateMaterial
);

// Delete Material
router.patch(
	"/deleteMaterial/:id",
	validateRequest(materialParamsSchema, "params"),
	materialController.deleteMaterial
);

export default router;
