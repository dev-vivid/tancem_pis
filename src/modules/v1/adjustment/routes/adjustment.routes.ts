import { Router } from "express";
import * as adjustmentController from "../controllers/adjustment.controller";
import {
	adjustmentFilterQuerySchema,
	adjustmentParamsSchema,
	createAdjustmentBodySchema,
	updateAdjustmentBodySchema,
} from "../validations/adjustment.schema";
import { validateRequest } from "@middleware/validateRequest";
//import { transactionTypeParamsSchema } from "@module/v1/master/validations/transactionType.schema";

const router = Router();

// Create Adjustment
router.post(
	"/addAdjustment",
	validateRequest(createAdjustmentBodySchema, "body"),
	adjustmentController.createAdjustment
);

// Get all Adjustments
router.get(
	"/getAll",
	validateRequest(adjustmentFilterQuerySchema, "query"),
	adjustmentController.getAllAdjustments
);

// Get Adjustment by ID
router.get(
	"/getadjustmentId/:id",

	validateRequest(adjustmentParamsSchema, "params"),
	adjustmentController.getAdjustmentById
);

// Update Adjustment
router.put(
	"/updateAdjustment/:id",
	validateRequest(updateAdjustmentBodySchema, "body"),
	validateRequest(adjustmentParamsSchema, "params"),

	adjustmentController.updateAdjustment
);

// Delete Adjustment
router.patch(
	"/deleteAdjustment/:id",
	validateRequest(adjustmentParamsSchema, "params"),
	adjustmentController.deleteAdjustment
);

export default router;
