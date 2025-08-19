import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import {
  createProductionCategoryBodySchema,
	productionCategoryFilterQuerySchema,
	getProductionCategoryParamsSchema,
	updateProductionCategoryBodySchema,
	updateProductionCategoryParamsSchema,
	deleteProductionCategoryParamsSchema
} from "../validations/productionCategory.schema";
import {
  getAllProductionCategory,
  getIdProductionCategory,
  createProductionCategory,
  updateProductionCategory,
  deleteProductionCategory
} from "../controllers/productionCategory.controller";

const productionCategoryRouter = express.Router();

productionCategoryRouter.get(
  "/productCategoryAll",
  validateRequest(productionCategoryFilterQuerySchema, "query"),
  getAllProductionCategory
);

productionCategoryRouter.get(
  "/productCategoryById/:id",
  validateRequest(getProductionCategoryParamsSchema, "params"),
  getIdProductionCategory
);

productionCategoryRouter.post(
  "/productionCategoryAdd",
  validateRequest(createProductionCategoryBodySchema, "body"),
  createProductionCategory
);

productionCategoryRouter.put(
  "/productCategoryUpdate/:id",
  validateRequest(updateProductionCategoryParamsSchema, "params"),
  validateRequest(updateProductionCategoryBodySchema, "body"),
  updateProductionCategory
);

productionCategoryRouter.patch(
  "/deleteProductCategory/:id",
	validateRequest(deleteProductionCategoryParamsSchema, "params"),
  deleteProductionCategory
);

export default productionCategoryRouter;
