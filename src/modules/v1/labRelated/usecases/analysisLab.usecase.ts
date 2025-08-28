import {
	createAnalysisLab,
	getAllAnalysisLab,
	getAnalysisLabById,
	updateAnalysisLab,
	deleteAnalysisLab,
} from "../services/analysisLab.service";

export const createAnalysisLabUsecase = async (data: any, user: string) =>
	await createAnalysisLab(data, user);

export const getAllAnalysisLabUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllAnalysisLab(accessToken, page, size);
};

export const getAnalysisLabByIdUsecase = async (
	id: string,
	accessToken: string
) => await getAnalysisLabById(id, accessToken);

export const updateAnalysisLabUsecase = async (
	id: string,
	data: any,
	user: string
) => await updateAnalysisLab(id, data, user);

export const deleteAnalysisLabUsecase = async (id: string, user: string) =>
	await deleteAnalysisLab(id, user);
