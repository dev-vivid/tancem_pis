import { Status } from "@prisma/client";
import {
  getAllProductionCategory,
  getIdProductionCategory,
  createProductionCategory,
  updateProductionCategory,
  deleteProductionCategory
} from "../services/productionCategory.service";

export const getAllProductionCategoryUsecase = async (
	  status: Status,
  pageNumber?: string,
  pageSize?: string
) => {
  return await getAllProductionCategory(status ,pageNumber, pageSize );
};

export const getIdProductionCategoryUsecase = async (id: string) => {
  return await getIdProductionCategory(id);
};

type TProductionCategoryData = {
  name: string;
  // categoryName: string; // ✅ matches Prisma model exactly
};

type TupdateProductionCategoryData = {
  name: string;
  // categoryName: string; // ✅ matches Prisma model exactly
	status:Status
};

export const createProductionCategoryUsecase = async (
  name: TProductionCategoryData,
  user: string
) => {
  return await createProductionCategory(name, user);
};

export const updateProductionCategoryUsecase = async (
  id: string,
  name: TupdateProductionCategoryData,
  user: string
) => {
  return await updateProductionCategory(id, name, user);
};

export const deleteProductionCategoryUsecase = async (
  id: string,
  user: string
) => {
  return await deleteProductionCategory(id, user);
};
