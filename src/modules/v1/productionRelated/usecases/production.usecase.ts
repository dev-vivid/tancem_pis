import { getAllproduction } from "../services/production.service";
import { getIdproduction } from "../services/production.service";
import { createproduction } from "../services/production.service";
import { updateproduction } from "../services/production.service";
import { deleteproduction } from "../services/production.service";

export const getAllproductionUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	// const page = pageNumber ? parseInt(pageNumber, 10) : 1;
	// const size = pageSize ? parseInt(pageSize, 10) : 10;
	return await getAllproduction(accessToken, pageNumber, pageSize);
};

export const getIdproductionUsecase = async (
	id: string,
	accessToken: string
) => {
	return await getIdproduction(id, accessToken);
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
