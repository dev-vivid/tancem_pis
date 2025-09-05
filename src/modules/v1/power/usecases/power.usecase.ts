import {
	getAllPowerTransactions,
	getPowerTransactionById,
	createPowerTransaction as createPowerService,
	updatePowerTransaction as updatePowerService,
	deletePowerTransaction,
} from "../services/power.service";

export const getAllPowerTransactionsUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAllPowerTransactions(accessToken, pageNumber, pageSize);
};

export const getPowerTransactionByIdUsecase = async (
	id: string,
	accessToken: string
) => {
	return await getPowerTransactionById(id, accessToken);
};

type TPowerDetail = {
	equipmentId: string;
	units: number;
};

type TPowerTransactionData = {
	transactionDate: Date;
	powerDetails: TPowerDetail[];
	initiatorRoleId: string;
	remarks: string;
	status: string;
};

export const createPowerTransactionUsecase = async (
	transactionData: TPowerTransactionData,
	user: string
) => {
	return await createPowerService(transactionData, user);
};

export const updatePowerTransactionUsecase = async (
	id: string,
	transactionData: TPowerTransactionData,
	user: string
) => {
	return await updatePowerService(id, transactionData, user);
};

export const deletePowerTransactionUsecase = async (
	id: string,
	powerDetailsId: string[],
	user: string
) => {
	return await deletePowerTransaction(id, powerDetailsId, user);
};
