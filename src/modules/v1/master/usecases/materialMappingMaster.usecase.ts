import { Status } from "@prisma/client";
import {
	
	getMaterialMappingById,
	createMaterialMapping as createMaterialMappingService,
	updateMaterialMapping as updateMaterialMappingService,
	deleteMaterialMapping as deleteMaterialMappingService,
	getAllMaterial,
} from "../services/materialMappingMaster.service";

// Get all material mappings use case
export const getAllMaterialMapUsecase = async (
  status: Status,
  pageNumber?: string,
  pageSize?: string
) => {
  return await getAllMaterial(status, pageNumber, pageSize);
};

// Get material mapping by ID use case
export const getIdMaterialMappingUsecase = async (id: string) => {
	return await getMaterialMappingById(id);
};

// Material Mapping data type for create
type TMaterialMappingData = {
	materialMasterId: string;
	mappedMaterialId: string;
	description?: string;
	sortOrder?: number;
  sourceId: string;
};

// Material Mapping data type for update
type TUpdateMaterialMappingData = {
	materialMasterId: string;
	mappedMaterialId: string;
	description?: string;
	sortOrder?: number;
	status: Status;
};

// Create material mapping use case
export const createMaterialMappingUsecase = async (
	materialMappingData: TMaterialMappingData,
	user: string
) => {
	return await createMaterialMappingService(materialMappingData, user);
};

// Update material mapping use case
export const updateMaterialMappingUsecase = async (
	id: string,
	updateMaterialMappingData: TUpdateMaterialMappingData,
	user: string
) => {
	return await updateMaterialMappingService(
		id,
		updateMaterialMappingData,
		user
	);
};

// Delete (soft delete) material mapping use case
export const deleteMaterialMappingUsecase = async (
	id: string,
	user: string
) => {
	return await deleteMaterialMappingService(id, user);
};
