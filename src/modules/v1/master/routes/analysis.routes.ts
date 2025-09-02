import express from "express";
import {
	getAllanalysis,
	getIdanalysis,
	createAnalysis,
	updateAnalysis,
	deleteAnalysis,
} from "../controllers/analysis.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	analysisFilterQuerySchema,
	analysisFormSchema,
	updateanalysisFormSchema,
} from "../validations/analysis.schema";

const analysisRouter = express.Router();

analysisRouter.get(
	"/analysis",
	validateRequest(analysisFilterQuerySchema, "query"),
	getAllanalysis
);

// analysisRouter.get(
// 	"/getMaterialAnalysis",
// 	validateRequest(analysisFilterQuerySchema, "query"),
// 	getMaterialAnalysis
// );

analysisRouter.get("/analysis/:id", getIdanalysis);

analysisRouter.post(
	"/analysisAdd",
	validateRequest(analysisFormSchema, "body"),
	createAnalysis
);

analysisRouter.put(
	"/analysisEdit/:id",
	validateRequest(updateanalysisFormSchema, "body"),
	updateAnalysis
);

analysisRouter.patch("/analysisDelete/:id", deleteAnalysis);

export default analysisRouter;
