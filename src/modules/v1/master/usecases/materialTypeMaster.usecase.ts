import {
  getAllMaterialTypeMaster,
  getIdMaterialTypeMaster,
  createMaterialTypeMaster,
  updateMaterialTypeMaster,
  deleteMaterialTypeMaster
} from "../services/materialTypeMaster.service";

export const getAllMaterialTypeMasterUsecase = async (
  pageNumber?: string,
  pageSize?: string
) => {
  return await getAllMaterialTypeMaster(pageNumber, pageSize);
};

export const getIdMaterialTypeMasterUsecase = async (id: string) => {
  return await getIdMaterialTypeMaster(id);
};

type TMaterialTypeMasterData = {
  name: string;
  materialTypeCode: string;
  isActive?: boolean;
};

export const createMaterialTypeMasterUsecase = async (
  materialTypeMasterData: TMaterialTypeMasterData,
  user: string
) => {
  return await createMaterialTypeMaster(materialTypeMasterData, user);
};

export const updateMaterialTypeMasterUsecase = async (
  id: string,
  materialTypeMasterData: TMaterialTypeMasterData,
  user: string
) => {
  return await updateMaterialTypeMaster(id, materialTypeMasterData, user);
};

export const deleteMaterialTypeMasterUsecase = async (
  id: string,
  user: string
) => {
  return await deleteMaterialTypeMaster(id, user);
};
