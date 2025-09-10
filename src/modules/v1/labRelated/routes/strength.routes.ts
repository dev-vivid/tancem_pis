import express from "express";
import {
	getAllStrength,
	getStrengthById,
	createStrength,
	updateStrength,
	deleteStrength,
	getStrengthSchedule,
} from "../controllers/strength.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	strengthFilterQuerySchema,
	strengthFormSchema,
} from "../validations/strength.schema";

const strengthRouter = express.Router();

strengthRouter.get(
	"/strength",
	validateRequest(strengthFilterQuerySchema, "query"),
	getAllStrength
);

strengthRouter.get("/strengthById/:id", getStrengthById);

strengthRouter.get("/strength/schedule", getStrengthSchedule);

strengthRouter.post(
	"/strengthAdd",
	validateRequest(strengthFormSchema, "body"),
	createStrength
);

strengthRouter.put(
	"/strengthEdit/:id",
	validateRequest(strengthFormSchema, "body"),
	updateStrength
);

strengthRouter.patch("/strengthDelete/:id", deleteStrength);

export default strengthRouter;
