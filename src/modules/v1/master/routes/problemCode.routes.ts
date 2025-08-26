import express from "express";
import {
	getAllproblemCode,
	getIdproblemCode,
	createproblemCode,
	updateproblemCode,
	deleteproblemCode,
} from "../controllers/problemCode.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	problemCodeFilterQuerySchema,
	problemCodeFormSchema,
	updateproblemCodeFormSchema
} from "../validations/problemCode.schema";

const problemCodeRouter = express.Router();

problemCodeRouter.get(
	"/problemCode",
	validateRequest(problemCodeFilterQuerySchema, "query"),
	getAllproblemCode
);

problemCodeRouter.get("/problemCode/:id", getIdproblemCode);

problemCodeRouter.post(
	"/problemCodeAdd",
	validateRequest(problemCodeFormSchema, "body"),
	createproblemCode
);

problemCodeRouter.put(
	"/problemCodeEdit/:id",
	validateRequest(updateproblemCodeFormSchema, "body"),
	updateproblemCode
);

problemCodeRouter.patch("/problemCodeDelete/:id", deleteproblemCode);

export default problemCodeRouter;
