import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
	materialTypeFilterQuerySchema,
	createMaterialTypeBodySchema,
	updateMaterialTypeBodySchema,
	updateMaterialTypeParamsSchema,
	deleteMaterialTypeParamsSchema,
	getMaterialTypeParamsSchema,
} from "../validations/materialType.schema";
import {
	getAllMaterialType,
	getIdMaterialType,
	createMaterialType,
	updateMaterialType,
	deleteMaterialType,
	getMaterialsByMaterialTypeIdController,
} from "../controllers/materialType.controller";

const materialTypeRouter = express.Router();

materialTypeRouter.get(
	"/allMaterialType",
	validateRequest(materialTypeFilterQuerySchema, "query"),
	getAllMaterialType
);

materialTypeRouter.get(
	"/materialTypeById/:id",
	validateRequest(getMaterialTypeParamsSchema, "params"),
	getIdMaterialType
);

materialTypeRouter.post(
	"/materialTypeAdd",
	validateRequest(createMaterialTypeBodySchema),
	createMaterialType
);

materialTypeRouter.put(
	"/materialTypeUpdate/:id",
	validateRequest(updateMaterialTypeParamsSchema, "params"),
	validateRequest(updateMaterialTypeBodySchema, "body"),
	updateMaterialType
);

materialTypeRouter.patch(
	"/deleteMaterialType/:id",
	validateRequest(deleteMaterialTypeParamsSchema, "params"),
	deleteMaterialType
);

materialTypeRouter.get(
	"/getMaterialsByMaterialTypeId/:materialTypeId",
	getMaterialsByMaterialTypeIdController
);

export default materialTypeRouter;
