import express from "express";
import {
	getAlldespatch,
	getIddespatch,
	createdespatch,
	updatedespatch,
	deletedespatch,
} from "../controllers/despatch.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	despatchFilterQuerySchema,
	despatchFormSchema,
} from "../validations/despatch.schema";

const despatchRouter = express.Router();

despatchRouter.get(
	"/despatch",
	validateRequest(despatchFilterQuerySchema, "query"),
	getAlldespatch
);
despatchRouter.get("/despatch/:id", getIddespatch);

despatchRouter.post(
	"/despatchAdd",
	validateRequest(despatchFormSchema, "body"),
	createdespatch
);

despatchRouter.put(
	"/despatchEdit/:id",
	validateRequest(despatchFormSchema, "body"),
	updatedespatch
);

despatchRouter.patch("/despatchDelete/:id", deletedespatch);

export default despatchRouter;
