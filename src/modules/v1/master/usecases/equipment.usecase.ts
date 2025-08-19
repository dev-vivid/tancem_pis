import {
	getAllEquipment,
	getEquipmentById,
	createEquipment,
	updateEquipment,
	deleteEquipment
} from "../services/equipment.service";

export const getAllEquipmentUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAllEquipment(pageNumber, pageSize);
};

export const getEquipmentByIdUsecase = async (id: string) => {
	return await getEquipmentById(id);
};

type TEquipmentData = {
	equipmentId: string;
	equipmentDescription: string;
	strength: string;
	quality: string;
	power: string;
	powerGroup: string;
	storage: string;
	orderOfAppearance: string;
};

export const createEquipmentUsecase = async (
	equipmentData: TEquipmentData,
	user: string
) => {
	return await createEquipment(equipmentData, user);
};

export const updateEquipmentUsecase = async (
	id: string,
	equipmentData:TEquipmentData,
	user: string
) => {
	return await updateEquipment(id, equipmentData, user);
};

export const deleteEquipmentUsecase = async (
	id: string,
	user: string
) => {
	return await deleteEquipment(id, user);
};
