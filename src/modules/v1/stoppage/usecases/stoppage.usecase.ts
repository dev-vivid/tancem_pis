import prisma from '@shared/prisma';
import { createStoppage, deleteStoppage, getAllStoppage, getStoppageById, updateStoppage } from "../services/stoppage.service";

type TStoppageProblem = {
	problemHours?: string; 
	problemId: string; 
	remarks?: string
}

type TUpdateStoppageProblem = {
	id: string,
	problemHours?: string; 
	problemId?: string; 
	remarks?: string
}

type TStoppage = {
	transactionDate: Date;
	departmentId: string,
  equipmentId: string;
  equipmentMainId: string;
  equipmentSubGroupId: string;
  equipmentSubSubGroupId: string;
  problems: TStoppageProblem[];   
}

type TUpdateStoppage = {
	transactionDate?: Date;
	departmentId?: string,
  equipmentId?: string;
  equipmentMainId?: string;
  equipmentSubGroupId?: string;
  equipmentSubSubGroupId?: string;
  problems?: TUpdateStoppageProblem[];   
}

export const createStoppageUsecase = async (
	transactionData: TStoppage,
	user: string
) => {
	return await createStoppage(transactionData, user);
};

export const getAllStoppageUsecase = async (
	pageNumber?: string,
	pageSize?: string,
) => {
	return await getAllStoppage(pageNumber, pageSize);
}

export const stoppageByIdUsecase = async (
	id: string
) => {
	return await getStoppageById(id);
};

export const updateStoppageUsecase = async (
	id: string,
	transactionData: TUpdateStoppage,
	user: string
) => {
	return await updateStoppage(id, transactionData, user); 
};

export const deleteStoppageUsecase = async (
	id: string,
	user: string
) => {
	return await deleteStoppage(id ,user);
}
