import { Status } from "@prisma/client";
import { getAllanalysis } from "../services/analysis.service";
import { getIdanalysis } from "../services/analysis.service";
import { createAnalysis } from "../services/analysis.service";
import { updateAnalysis } from "../services/analysis.service";
import { deleteAnalysis } from "../services/analysis.service";

export const getAllanalysisUsecase = async (
	accessToken: string,
	materialId: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllanalysis(accessToken, materialId, page, size, status);
};

// export const getMaterialAnalysisUsecase = async (
// 	materialId: string
// 	// pageNumber?: string,
// 	// pageSize?: string,
// 	// status?: string
// ) => {
// 	// const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
// 	// const size = pageSize ? parseInt(pageSize, 10) : undefined;
// 	return await getMaterialAnalysis(materialId);
// };

export const getIdanalysisUsecase = async (id: string, accessToken: string) => {
	return await getIdanalysis(id, accessToken);
};

type TAnalysisData = {
	analysisType: string;
	description?: string;
	materialId: string;
};

type TUpdateAnalysisData = {
	analysisType: string;
	description?: string;
	materialId: string;
	status: Status;
};

export const createAnalysisUsecase = async (
	analysisData: TAnalysisData,
	user: string
) => {
	return await createAnalysis(analysisData, user);
};

export const updateAnalysisUsecase = async (
	id: string,
	updateAnalysisData: TUpdateAnalysisData,
	user: string
) => {
	return await updateAnalysis(id, updateAnalysisData, user);
};

export const deleteAnalysisUsecase = async (id: string, user: string) => {
	return await deleteAnalysis(id, user);
};
