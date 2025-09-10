import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	mappingFilterQuerySchema,
	createMappingBodySchema,
	updateMappingBodySchema,
	updateMappingParamsSchema,
	deleteMappingParamsSchema,
	getMappingParamsSchema,
} from "../validations/equipmentOutputMaterialMapping.schema";
import {
	getAllMapping,
	getMappingByIdController,
	createMapping,
	updateMapping,
	deleteMapping,
} from "../controllers/equipmentOutputMaterialMapping.controller";

const equipmentOutputMappingRouter = express.Router();

equipmentOutputMappingRouter.get(
	"/allMappings",
	validateRequest(mappingFilterQuerySchema, "query"),
	getAllMapping
);

equipmentOutputMappingRouter.get(
	"/mappingById/:id",
	validateRequest(getMappingParamsSchema, "params"),
	getMappingByIdController
);

equipmentOutputMappingRouter.post(
	"/mappingAdd",
	validateRequest(createMappingBodySchema, "body"),
	createMapping
);

equipmentOutputMappingRouter.put(
	"/mappingUpdate/:id",
	validateRequest(updateMappingParamsSchema, "params"),
	validateRequest(updateMappingBodySchema, "body"),
	updateMapping
);

equipmentOutputMappingRouter.patch(
	"/deleteMapping/:id",
	validateRequest(deleteMappingParamsSchema, "params"),
	deleteMapping
);

export default equipmentOutputMappingRouter;
