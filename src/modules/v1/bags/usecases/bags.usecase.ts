import {
	getAllBags,
	getIdBags,
	createBags as createBagsService,
	updateBags as updateBagsService,
	deleteBags as deleteBagsService
} from "../../bags/services/bags.service";

export const getAllBagsUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAllBags(pageNumber, pageSize);
};

export const getIdBagsUsecase = async (id: string) => {
	return await getIdBags(id);
};

type TBagsData = {
	transactionDate: Date;
	materialId: string;
	opc: number;
	ppc: number;
	src: number;
	burstopc: number;
	burstppc: number;
	burstsrc: number;
	export: number;
	deport: number;
	transferQty: number;
};

export const createBagsUsecase = async (
	bagsData: TBagsData,
	user: string
) => {
	return await createBagsService(bagsData, user);
};

export const updateBagsUsecase = async (
	id: string,
	bagsData: TBagsData,
	user: string
) => {
	return await updateBagsService(id, bagsData, user);
};

export const deleteBagsUsecase = async (id: string, user: string) => {
	return await deleteBagsService(id, user);
};
