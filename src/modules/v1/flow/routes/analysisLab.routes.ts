import express from "express";
import {
	getAllAnalysisLab,
	getAnalysisLabById,
	createAnalysisLab,
	updateAnalysisLab,
	deleteAnalysisLab,
} from "../controllers/analysisLab.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	analysisLabFilterQuerySchema,
	analysisLabFormSchema,
} from "../validations/analysisLab.schema";

const analysisLabRouter = express.Router();

analysisLabRouter.get(
	"/analysisLab",
	validateRequest(analysisLabFilterQuerySchema, "query"),
	getAllAnalysisLab
);

analysisLabRouter.get("/analysisLabById/:id", getAnalysisLabById);

analysisLabRouter.post(
	"/analysisLabAdd",
	validateRequest(analysisLabFormSchema, "body"),
	createAnalysisLab
);

analysisLabRouter.put(
	"/analysisLabEdit/:id",
	validateRequest(analysisLabFormSchema, "body"),
	updateAnalysisLab
);

analysisLabRouter.post("/analysisLabsDelete/:id", deleteAnalysisLab);

export default analysisLabRouter;
