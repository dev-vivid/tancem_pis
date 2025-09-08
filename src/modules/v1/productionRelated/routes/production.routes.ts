import express from "express";
import {
	getAllproduction,
	getIdproduction,
	createproduction,
	updateproduction,
	deleteproduction,
} from "../controllers/production.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	productionFilterQuerySchema,
	productionFormSchema,
	productionCreateFormSchema
} from "../validations/production.schema";

const productionRouter = express.Router();

productionRouter.get(
	"/production",
	validateRequest(productionFilterQuerySchema, "query"),
	getAllproduction
);
productionRouter.get("/production/:id", getIdproduction);

productionRouter.post(
	"/productionAdd",
	validateRequest(productionCreateFormSchema, "body"),
	createproduction
);

productionRouter.put(
	"/productionEdit/:id",
	validateRequest(productionFormSchema, "body"),
	updateproduction
);

productionRouter.patch("/productionDelete/:id", deleteproduction);

export default productionRouter;
