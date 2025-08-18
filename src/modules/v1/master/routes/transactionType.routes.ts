// src/modules/v1/master/routes/transactionType.routes.ts

import express from "express";
import {
	getAllTransactionTypes,
	getTransactionTypeById,
	createTransactionType,
	updateTransactionType,
	deleteTransactionType,
} from "../controllers/transactionType.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	createTransactionTypeBodySchema,
	transactionTypeFilterQuerySchema,
	transactionTypeParamsSchema,
} from "../validations/transactionType.schema";

const transactionTypeRouter = express.Router();

// GET all transaction types
transactionTypeRouter.get(
	"/transaction-types",
	validateRequest(transactionTypeFilterQuerySchema, "query"),
	getAllTransactionTypes
);

// GET transaction type by ID
transactionTypeRouter.get(
	"/transaction-types/:id",
	validateRequest(transactionTypeParamsSchema, "params"),
	getTransactionTypeById
);

// CREATE transaction type
transactionTypeRouter.post(
	"/transaction-types",
	validateRequest(createTransactionTypeBodySchema, "body"),
	createTransactionType
);

// UPDATE transaction type
transactionTypeRouter.put(
	"/transaction-types/:id",
	validateRequest(transactionTypeParamsSchema, "params"),
	updateTransactionType
);

// DELETE transaction type
transactionTypeRouter.patch(
	"/transaction-types/:id",
	validateRequest(transactionTypeParamsSchema, "params"),
	deleteTransactionType
);

export default transactionTypeRouter;
