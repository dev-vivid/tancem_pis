import { getAlldespatch } from "../services/despatch.service";
import { getIddespatch } from "../services/despatch.service";
import { createdespatch } from "../services/despatch.service";
import { updatedespatch } from "../services/despatch.service";
import { deletedespatch } from "../services/despatch.service";

export const getAlldespatchUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAlldespatch(page, size);
};

export const getIddespatchUsecase = async (id: string) => {
	return await getIddespatch(id);
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
	return await updatedespatch(id, despatchData, user);
};

export const deletedespatchUsecase = async (id: string, user: string) => {
	return await deletedespatch(id, user);
};
