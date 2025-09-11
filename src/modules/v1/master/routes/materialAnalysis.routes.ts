import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	materialAnalysisFilterQuerySchema,
	createMaterialAnalysisBodySchema,
	updateMaterialAnalysisBodySchema,
	updateMaterialAnalysisParamsSchema,
	deleteMaterialAnalysisParamsSchema,
	getMaterialAnalysisParamsSchema,
} from "../validations/materialAnalysis.schema";
import {
	getAllMaterialAnalysis,
	getIdMaterialAnalysis,
	createMaterialAnalysis,
	updateMaterialAnalysis,
	deleteMaterialAnalysis,
} from "../controllers/materialAnalysis.controller";

const materialAnalysisRouter = express.Router();

materialAnalysisRouter.get(
	"/allMaterialAnalysis",
	validateRequest(materialAnalysisFilterQuerySchema, "query"),
	getAllMaterialAnalysis
);

materialAnalysisRouter.get(
	"/materialAnalysisById/:id",
	validateRequest(getMaterialAnalysisParamsSchema, "params"),
	getIdMaterialAnalysis
);

materialAnalysisRouter.post(
	"/materialAnalysisAdd",
	//  validateRequest(createMaterialAnalysisBodySchema),
	createMaterialAnalysis
);

materialAnalysisRouter.put(
	"/materialAnalysisUpdate/:id",
	validateRequest(updateMaterialAnalysisParamsSchema, "params"),
	validateRequest(updateMaterialAnalysisBodySchema, "body"),
	updateMaterialAnalysis
);

materialAnalysisRouter.patch(
	"/deleteMaterialAnalysis/:id",
	validateRequest(deleteMaterialAnalysisParamsSchema, "params"),
	deleteMaterialAnalysis
);

export default materialAnalysisRouter;
