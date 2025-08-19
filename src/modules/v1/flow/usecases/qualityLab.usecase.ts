import {
	createQualityLab,
	getAllQualityLab,
	getQualityLabById,
	updateQualityLab,
	deleteQualityLab,
} from "../services/qualityLab.service";

export const createQualityLabUsecase = async (data: any, user: string) =>
	await createQualityLab(data, user);

export const getAllQualityLabUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllQualityLab(page, size);
};

export const getQualityLabByIdUsecase = async (id: string) =>
	await getQualityLabById(id);

export const updateQualityLabUsecase = async (
	id: string,
	data: any,
	user: string
) => await updateQualityLab(id, data, user);

export const deleteQualityLabUsecase = async (id: string, user: string) =>
	await deleteQualityLab(id, user);
