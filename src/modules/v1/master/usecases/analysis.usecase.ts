import { getAllanalysis } from "../services/analysis.service";
import { getIdanalysis } from "../services/analysis.service";
import { createAnalysis } from "../services/analysis.service";
import { updateAnalysis } from "../services/analysis.service";
import { deleteAnalysis } from "../services/analysis.service";

export const getAllanalysisUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
	const size = pageSize ? parseInt(pageSize, 10) : undefined;
	return await getAllanalysis(page, size);
};

export const getIdanalysisUsecase = async (id: string) => {
	return await getIdanalysis(id);
};

type TAnalysisData = {
	analysisType: string;
	description?: string;
};
export const createAnalysisUsecase = async (
	analysisData: TAnalysisData,
	user: string
) => {
	return await createAnalysis(analysisData, user);
};

export const updateAnalysisUsecase = async (
	id: string,
	analysisData: TAnalysisData,
	user: string
) => {
	return await updateAnalysis(id, analysisData, user);
};

export const deleteAnalysisUsecase = async (id: string, user: string) => {
	return await deleteAnalysis(id, user);
};
