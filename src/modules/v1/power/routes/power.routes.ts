import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	powerFilterQuerySchema,
	getPowerTransactionParamsSchema,
	createPowerTransactionBodySchema,
	updatePowerTransactionParamsSchema,
	updatePowerTransactionBodySchema,
	deletePowerTransactionParamsSchema
} from "../validations/power.schema";

import {
	getAllPower,
	getPowerById,
	createPower,
	updatePower,
	deletePower
} from "../controllers/power.controller";

const powerRouter = express.Router();

powerRouter.get(
	"/allPowers",
	validateRequest(powerFilterQuerySchema, "query"),
	getAllPower
);

powerRouter.get(
	"/powerById/:id",
	validateRequest(getPowerTransactionParamsSchema, "params"),
	getPowerById
);

powerRouter.post(
	"/powerAdd",
	validateRequest(createPowerTransactionBodySchema, "body"),
	createPower
);

powerRouter.put(
	"/powerUpdate/:id",
	validateRequest(updatePowerTransactionParamsSchema, "params"),
	validateRequest(updatePowerTransactionBodySchema, "body"),
	updatePower
);

powerRouter.patch(
	"/deletePower/:transactionId",
	validateRequest(deletePowerTransactionParamsSchema, "params"),
	deletePower
);

export default powerRouter;
