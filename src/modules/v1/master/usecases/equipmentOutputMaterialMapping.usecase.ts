import { Status } from "@prisma/client";
import {
	getAllEquipmentOutputMaterialMappings as getAllMappings,
	getEquipmentOutputMaterialMappingById as getMappingById,
	createEquipmentOutputMaterialMapping as createMappingService,
	updateEquipmentOutputMaterialMapping as updateMappingService,
	deleteEquipmentOutputMaterialMapping as deleteMappingService,
} from "../services/equipmentOutputMaterialMapping.service";

export const getAllMappingsUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string
) => {
	return await getAllMappings(accessToken, pageNumber, pageSize, status);
};

export const getMappingByIdUsecase = async (
	id: string,
	accessToken: string
) => {
	return await getMappingById(id, accessToken);
};

type TCreateMapping = {
	equipmentId: string;
	materialId: string;
};

type TUpdateMapping = {
	equipmentId?: string;
	materialId?: string;
	status: Status;
};

export const createMappingUsecase = async (
	mappingData: TCreateMapping,
	user: string
) => {
	return await createMappingService(mappingData, user);
};

export const updateMappingUsecase = async (
	id: string,
	updateData: TUpdateMapping,
	user: string
) => {
	return await updateMappingService(id, updateData, user);
};

export const deleteMappingUsecase = async (id: string, user: string) => {
	return await deleteMappingService(id, user);
};
