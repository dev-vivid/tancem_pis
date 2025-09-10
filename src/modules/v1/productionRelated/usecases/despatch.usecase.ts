import { getAlldespatch } from "../services/despatch.service";
import { getIddespatch } from "../services/despatch.service";
import { createdespatch } from "../services/despatch.service";
import { updateDespatch } from "../services/despatch.service";
import { deletedespatch } from "../services/despatch.service";

export const getAlldespatchUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAlldespatch(accessToken, pageNumber, pageSize);
};

export const getIddespatchUsecase = async (id: string, accessToken: string) => {
	return await getIddespatch(id, accessToken);
};

export const createdespatchUsecase = async (
	despatchData: any,
	user: string
) => {
	return await createdespatch(despatchData, user);
};

export const updatedespatchUsecase = async (
	id: string,
	despatchData: any,
	user: string
) => {
	return await updateDespatch(id, despatchData, user);
};

export const deletedespatchUsecase = async (id: string, user: string) => {
	return await deletedespatch(id, user);
};
