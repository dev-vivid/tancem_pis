import { getAllproduction } from "../services/production.service";
import { getIdproduction } from "../services/production.service";
import { createproduction } from "../services/production.service";
import { updateproduction } from "../services/production.service";
import { deleteproduction } from "../services/production.service";

export const getAllproductionUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllproduction(page, size);
};

export const getIdproductionUsecase = async (id: string) => {
	return await getIdproduction(id);
};

export const createproductionUsecase = async (
	productionData: any,
	user: string
) => {
	return await createproduction(productionData, user);
};

export const updateproductionUsecase = async (
	id: string,
	productionData: any,
	user: string
) => {
	return await updateproduction(id, productionData, user);
};

export const deleteproductionUsecase = async (id: string, user: string) => {
	return await deleteproduction(id, user);
};
