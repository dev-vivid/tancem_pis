import { Status } from "@prisma/client";
import {
	createAnnualMaterialBudget as createAnnualMaterialBudgetService,
	updateAnnualMaterialBudget as updateAnnualMaterialBudgetService,
	getAllAnnualMaterialBudget as getAllService,
	deleteAnnualMaterialBudget as deleteAnnualMaterialBudgetService,
	getAnnualMaterialBudgetByID as getByIdService,
} from "../services/annualMaterialBudget.service";

export const getAllAnnualMaterialBudgetUsecase = async (
	pageNumber?: string,
	pageSize?: string,
	status?: string,
) => {
	return await getAllService(pageNumber, pageSize, status);
};

export const getIdAnnualMaterialBudgetUsecase = async (id: string) => {
	return await getByIdService(id);
};

// AnnualMaterialBudget data type for create/update
type TAnnualMaterialBudgetData = {
	financialYear: string;
	month: number;
	year: number;
	materialId: string;
	value: number;
};

type TUpdateAnnualMaterialBudgetData = {
	financialYear: string;
	month: number;
	year: number;
	materialId: string;
	value: number;
	status: Status;
};

export const createAnnualMaterialBudgetUsecase = async (
	annualMaterialBudgetData: TAnnualMaterialBudgetData,
	user: string
) => {
	return await createAnnualMaterialBudgetService(annualMaterialBudgetData, user);
};

export const updateAnnualMaterialBudgetUsecase = async (
	id: string,
	updateAnnualMaterialBudgetData: TUpdateAnnualMaterialBudgetData,
	user: string
) => {
	return await updateAnnualMaterialBudgetService(id, updateAnnualMaterialBudgetData, user);
};

export const deleteAnnualMaterialBudgetUsecase = async (
	id: string,
	user: string
) => {
	return await deleteAnnualMaterialBudgetService(id, user);
};
