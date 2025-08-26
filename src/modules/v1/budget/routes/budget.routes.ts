import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	budgetFilterQuerySchema,
	createBudgetBodySchema,
	updateBudgetBodySchema,
	updateBudgetParamsSchema,
	deleteBudgetParamsSchema,
	getBudgetParamsSchema,
} from "../validations/budget.schema";

import {
	getAllBudgetsController,
	getBudgetByIdController,
	createBudgetController,
	updateBudgetController,
	deleteBudgetController,
} from "../controllers/budget.controller";

const budgetRouter = express.Router();

budgetRouter.get(
	"/allBudgets",
	validateRequest(budgetFilterQuerySchema, "query"),
	getAllBudgetsController
);

budgetRouter.get(
	"/budgetById/:id",
	validateRequest(getBudgetParamsSchema, "params"),
	getBudgetByIdController
);

budgetRouter.post(
	"/budgetAdd",
	validateRequest(createBudgetBodySchema),
	createBudgetController
);

budgetRouter.put(
	"/budgetUpdate/:id",
	validateRequest(updateBudgetParamsSchema, "params"),
	validateRequest(updateBudgetBodySchema, "body"),
	updateBudgetController
);

budgetRouter.patch(
	"/deleteBudget/:id",
	validateRequest(deleteBudgetParamsSchema, "params"),
	deleteBudgetController
);

export default budgetRouter;
