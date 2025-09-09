import { getAllreceipt } from "../services/receipt.service";
import { getIdreceipt } from "../services/receipt.service";
import { createreceipt } from "../services/receipt.service";
import { updatereceipt } from "../services/receipt.service";
import { deletereceipt } from "../services/receipt.service";

export const getAllreceiptUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllreceipt(accessToken, page, size);
};

export const getIdreceiptUsecase = async (id: string, accessToken: string) => {
	return await getIdreceipt(id, accessToken);
};

export const createreceiptUsecase = async (receiptData: any, user: string) => {
	return await createreceipt(receiptData, user);
};

export const updatereceiptUsecase = async (
	id: string,
	receiptData: any,
	user: string
) => {
	return await updatereceipt(id, receiptData, user);
};

export const deletereceiptUsecase = async (id: string, user: string) => {
	return await deletereceipt(id, user);
};
