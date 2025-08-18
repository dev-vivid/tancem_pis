import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
  materialTypeMasterFilterQuerySchema,
  createMaterialTypeMasterBodySchema,
  updateMaterialTypeMasterBodySchema,
  updateMaterialTypeMasterParamsSchema,
  deleteMaterialTypeMasterParamsSchema,
  getMaterialTypeMasterParamsSchema
} from "../validations/materialTypeMaster.schema";

import {
  getAllMaterialTypeMaster,
  getMaterialTypeMasterById,
  createMaterialTypeMaster,
  updateMaterialTypeMaster,
  deleteMaterialTypeMaster
} from "../controllers/materialTypeMaster.controller";

const materialTypeMasterRouter = express.Router();

materialTypeMasterRouter.get(
  "/materialTypeMasterAll",
  validateRequest(materialTypeMasterFilterQuerySchema, "query"),
  getAllMaterialTypeMaster
);

materialTypeMasterRouter.get(
  "/materialTypeMasterById/:id",
  validateRequest(getMaterialTypeMasterParamsSchema, "params"),
  getMaterialTypeMasterById
);

materialTypeMasterRouter.post(
  "/materialTypeMasterAdd",
  validateRequest(createMaterialTypeMasterBodySchema),
  createMaterialTypeMaster
);

materialTypeMasterRouter.put(
  "/materialTypeMasterUpdate/:id",
  validateRequest(updateMaterialTypeMasterParamsSchema, "params"),
  validateRequest(updateMaterialTypeMasterBodySchema, "body"),
  updateMaterialTypeMaster
);

materialTypeMasterRouter.patch(
  "/deleteMaterialTypeMaster/:id",
  validateRequest(deleteMaterialTypeMasterParamsSchema, "params"),
  deleteMaterialTypeMaster
);

export default materialTypeMasterRouter;
