import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	annualMaterialBudgetFilterQuerySchema,
	createAnnualMaterialBudgetBodySchema,
	updateAnnualMaterialBudgetBodySchema,
	updateAnnualMaterialBudgetParamsSchema,
	deleteAnnualMaterialBudgetParamsSchema,
	getAnnualMaterialBudgetParamsSchema
} from "../validations/annualMaterialBudget.schema";
import {
	getAllAnnualMaterialBudget,
	getIdAnnualMaterialBudget,
	createAnnualMaterialBudget,
	updateAnnualMaterialBudget,
	deleteAnnualMaterialBudget
} from "../controllers/annualMaterialBudget.controller";

const annualMaterialBudgetRouter = express.Router();

annualMaterialBudgetRouter.get(
	"/allAnnualMaterialBudget",
	validateRequest(annualMaterialBudgetFilterQuerySchema, "query"),
	getAllAnnualMaterialBudget
);

annualMaterialBudgetRouter.get(
	"/annualMaterialBudgetById/:id",
	validateRequest(getAnnualMaterialBudgetParamsSchema, "params"),
	getIdAnnualMaterialBudget
);

annualMaterialBudgetRouter.post(
	"/annualMaterialBudgetAdd",
	validateRequest(createAnnualMaterialBudgetBodySchema),
	createAnnualMaterialBudget
);

annualMaterialBudgetRouter.put(
	"/annualMaterialBudgetUpdate/:id",
	validateRequest(updateAnnualMaterialBudgetParamsSchema, "params"),
	validateRequest(updateAnnualMaterialBudgetBodySchema, "body"),
	updateAnnualMaterialBudget
);

annualMaterialBudgetRouter.patch(
	"/deleteAnnualMaterialBudget/:id",
	validateRequest(deleteAnnualMaterialBudgetParamsSchema, "params"),
	deleteAnnualMaterialBudget
);

export default annualMaterialBudgetRouter;
