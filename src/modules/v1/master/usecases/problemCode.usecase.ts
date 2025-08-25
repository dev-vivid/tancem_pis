import { Status } from "@prisma/client";
import { getAllProblemCode } from "../services/problemCode.service";
import { getIdProblemCode } from "../services/problemCode.service";
import { createProblemCode } from "../services/problemCode.service";
import { updateProblemCode } from "../services/problemCode.service";
import { deleteProblemCode } from "../services/problemCode.service";

export const getAllProblemCodeUsecase = async (
	pageNumber?: string,
	pageSize?: string,
	status?: string
) => {
	// const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	// const size = pageSize ? parseInt(pageSize, 10) : undefined;
	// return await getAllProblemCode(page, size);
	return await getAllProblemCode(pageNumber, pageSize, status);
};

export const getIdProblemCodeUsecase = async (id: string) => {
	return await getIdProblemCode(id);
};

type TproblemCodeData = {
	problemId: string;
	equipmentId: string;
	departmentId: string;
};

type TUpdateproblemCodeData = {
	problemId: string;
	equipmentId: string;
	departmentId: string;
	status: Status;
};
export const createProblemCodeUsecase = async (
	problemCodeData: TproblemCodeData,
	user: string
) => {
	return await createProblemCode(problemCodeData, user);
};

export const updateProblemCodeUsecase = async (
	id: string,
	updateProblemCodeData: TUpdateproblemCodeData,
	user: string
) => {
	return await updateProblemCode(id, updateProblemCodeData, user);
};

export const deleteProblemCodeUsecase = async (id: string, user: string) => {
	return await deleteProblemCode(id, user);
};
