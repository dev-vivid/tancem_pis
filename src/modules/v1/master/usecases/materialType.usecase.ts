import { 
	createMaterialType as createMaterialTypeService,
	updateMaterialType as updateMaterialTypeService,
	getAllMaterialType as getAllService,
	deleteMaterialType as deleteMaterialType,
	getByID as getByIdService,
} from "../services/materialType.service";

// Get all material type use case
export const getAllMaterialTypeUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAllService(pageNumber, pageSize);
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
	materialTypeData: TMaterialTypeData,
	user: string
) => {
	return await updateMaterialTypeService(id, materialTypeData, user);
};

// Delete (soft delete) material type use case
export const deleteMaterialTypeUsecase = async (id: string, user: string) => {
	return await deleteMaterialType(id, user);
};
