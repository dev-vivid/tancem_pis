import {
	createStrength,
	getAllStrength,
	getStrengthById,
	updateStrength,
	deleteStrength,
	getStrengthSchedule,
} from "../services/strength.service";

export const createStrengthUsecase = async (data: any, user: string) =>
	await createStrength(data, user);

export const getStrengthScheduleUsecase = async (
	transactionDate: string,
	materialId: string
) => {
	return await getStrengthSchedule(transactionDate, materialId);
};

export const getAllStrengthUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllStrength(accessToken, page, size);
};

export const getStrengthByIdUsecase = async (id: string, accessToken: string) =>
	await getStrengthById(id, accessToken);

export const updateStrengthUsecase = async (
	id: string,
	data: any,
	user: string
) => await updateStrength(id, data, user);

export const deleteStrengthUsecase = async (id: string, user: string) =>
	await deleteStrength(id, user);
