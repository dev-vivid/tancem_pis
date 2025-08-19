import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	bagsFilterQuerySchema,
	createBagsBodySchema,
	updateBagsBodySchema,
	updateBagsParamsSchema,
	deleteBagsParamsSchema,
	getBagsParamsSchema
} from "../validations/bags.schema";

import {
	getAllBagsController,
	getBagsByIdController,
	createBagsController,
	updateBagsController,
	deleteBagsController
} from "../controllers/bags.controller";

const bagsRouter = express.Router();

bagsRouter.get(
	"/allBags",
	validateRequest(bagsFilterQuerySchema, "query"),
	getAllBagsController
);

bagsRouter.get(
	"/bagsById/:id",
	validateRequest(getBagsParamsSchema, "params"),
	getBagsByIdController
);

bagsRouter.post(
	"/bagsAdd",
	validateRequest(createBagsBodySchema),
	createBagsController
);

bagsRouter.put(
	"/bagsUpdate/:id",
	validateRequest(updateBagsParamsSchema, "params"),
	validateRequest(updateBagsBodySchema, "body"),
	updateBagsController
);

bagsRouter.patch(
	"/deleteBags/:id",
	validateRequest(deleteBagsParamsSchema, "params"),
	deleteBagsController
);

export default bagsRouter;
