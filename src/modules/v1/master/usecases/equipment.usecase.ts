import { Status } from "@prisma/client";
import {
	getAllEquipment,
	getEquipmentById,
	createEquipment,
	updateEquipment,
	deleteEquipment
} from "../services/equipment.service";

export const getAllEquipmentUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	) => {
	return await getAllEquipment( accessToken, pageNumber, pageSize, status);
};

export const getEquipmentByIdUsecase = async (id: string, accessToken: string) => {
	return await getEquipmentById(id);
};

type TEquipmentData = {
	equipmentId: string;
	equipmentDescription: string;
	strength: string;
	analysis: string;
	quality: string;
	power: string;
	powerGroup: string;
	storage: string;
	orderOfAppearance: string;
};

type TUpdateEquipmentData = {
	equipmentId: string;
	equipmentDescription: string;
	strength: string;
	analysis: string;
	quality: string;
	power: string;
	powerGroup: string;
	storage: string;
	orderOfAppearance: string;
	status:Status
};



export const createEquipmentUsecase = async (
	equipmentData: TEquipmentData,
	user: string
) => {
	return await createEquipment(equipmentData, user);
};

export const updateEquipmentUsecase = async (
	id: string,
	equipmentData:TUpdateEquipmentData,
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
