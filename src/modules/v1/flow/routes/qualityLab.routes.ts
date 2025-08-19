import express from "express";
import {
	getAllQualityLab,
	getQualityLabById,
	createQualityLab,
	updateQualityLab,
	deleteQualityLab,
} from "../controllers/qualityLab.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	qualityLabFilterQuerySchema,
	qualityLabFormSchema,
} from "../validations/qualityLab.schema";

const qualityLabRouter = express.Router();

qualityLabRouter.get(
	"/getAllQualityLab",
	validateRequest(qualityLabFilterQuerySchema, "query"),
	getAllQualityLab
);

qualityLabRouter.get("/getQualityLabById/:id", getQualityLabById);

qualityLabRouter.post(
	"/qualityLabAdd",
	validateRequest(qualityLabFormSchema, "body"),
	createQualityLab
);

qualityLabRouter.put(
	"/qualityLabEdit/:id",
	validateRequest(qualityLabFormSchema, "body"),
	updateQualityLab
);

qualityLabRouter.post("/qualityLabDelete/:id", deleteQualityLab);

export default qualityLabRouter;
