import {
  getAllProductionCategory,
  getIdProductionCategory,
  createProductionCategory,
  updateProductionCategory,
  deleteProductionCategory
} from "../services/productionCategory.service";

export const getAllProductionCategoryUsecase = async (
  pageNumber?: string,
  pageSize?: string
) => {
  return await getAllProductionCategory(pageNumber, pageSize);
};

export const getIdProductionCategoryUsecase = async (id: string) => {
  return await getIdProductionCategory(id);
};

type TProductionCategoryData = {
  name: string;
  productCatagoryCode: string; // ✅ matches Prisma model exactly
  isActive?: boolean;
};

export const createProductionCategoryUsecase = async (
  productionCategoryData: TProductionCategoryData,
  user: string
) => {
  return await createProductionCategory(productionCategoryData, user);
};

export const updateProductionCategoryUsecase = async (
  id: string,
  productionCategoryData: TProductionCategoryData,
  user: string
) => {
  return await updateProductionCategory(id, productionCategoryData, user);
};

export const deleteProductionCategoryUsecase = async (
  id: string,
  user: string
) => {
  return await deleteProductionCategory(id, user);
};
