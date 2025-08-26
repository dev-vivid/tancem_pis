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
	updateTransactionTypeBodySchema
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
	"/transaction-typesById/:id",
	validateRequest(transactionTypeParamsSchema, "params"),
	getTransactionTypeById
);

// CREATE transaction type
transactionTypeRouter.post(
	"/transaction-typesCreate",
	validateRequest(createTransactionTypeBodySchema, "body"),
	createTransactionType
);

// UPDATE transaction type
transactionTypeRouter.put(
	"/transaction-typesUpdate/:id",
	validateRequest(transactionTypeParamsSchema, "params"),
	validateRequest(updateTransactionTypeBodySchema, "body"),
	updateTransactionType
);

// DELETE transaction type
transactionTypeRouter.patch(
	"/transaction-typesDelete/:id",
	validateRequest(transactionTypeParamsSchema, "params"),
	deleteTransactionType
);

export default transactionTypeRouter;
