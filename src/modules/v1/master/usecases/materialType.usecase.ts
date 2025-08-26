import { 
	createMaterialType as createMaterialTypeService,
	updateMaterialType as updateMaterialTypeService,
	getAllMaterialType as getAllService,
	deleteMaterialType as deleteMaterialType,
	getByID as getByIdService,
} from "../services/materialType.service";
import { Status } from "@prisma/client";

// Get all material type use case
export const getAllMaterialTypeUsecase = async (
	pageNumber?: string,
	pageSize?: string,
	status?: string
) => {
	return await getAllService(pageNumber, pageSize, status);
};

// Get problem by ID use case
export const getIdMaterialTypeUsecase = async (id: string) => {
	return await getByIdService(id);
};

// MaterialType master data type for create/update
type TMaterialTypeData = {
	materialId: string;
	materialTypeMasterId: string;
};

type TUpdateMaterialTypeData = {
	materialId: string;
	materialTypeMasterId: string;
	status: Status;
};

// Create material Type use case
export const createMaterialTypeUsecase = async (
	materialTypeData: TMaterialTypeData,
	user: string
) => {
	return await createMaterialTypeService(materialTypeData, user);
};

// Update material type use case
export const updateMaterialTypeUsecase = async (
	id: string,
	updatematerialTypeData: TUpdateMaterialTypeData,
	user: string
) => {
	return await updateMaterialTypeService(id, updatematerialTypeData, user);
};

// Delete (soft delete) material type use case
export const deleteMaterialTypeUsecase = async (id: string, user: string) => {
	return await deleteMaterialType(id, user);
};
