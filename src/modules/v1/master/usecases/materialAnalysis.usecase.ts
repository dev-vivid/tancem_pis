import { Status } from "@prisma/client";
import { 
	createMaterialAnalysis as createMaterialAnalysisService,
	updateMaterialAnalysis as updateMaterialAnalysisService,
	getAllMaterialAnalysis as getAllService,
	deleteMaterialAnalysis as deleteMaterialAnalysis,
	getByID as getByIdService,
} from "../services/materialAnalysis.service";

export const getAllMaterialAnalysisUsecase = async (
	pageNumber?: string,
	pageSize?: string,
	status?: string,
) => {
	return await getAllService(pageNumber, pageSize, status);
};

export const getIdMaterialAnalysisUsecase = async (id: string) => {
	return await getByIdService(id);
};

//material analysis data type for create/update
type TMaterialAnalysisData = {
	materialId: string;
	analysisId: string;
};

type TUpdateMaterialAnalysisData = {
	materialId: string;
	analysisId: string;
	status: Status;
};

export const createMaterialAnalysisUsecase = async (
	materialAnalysisData: TMaterialAnalysisData,
	user: string
) => {
	return await createMaterialAnalysisService(materialAnalysisData, user);
};

export const updateMaterialAnalysisUsecase = async (
	id: string,
	updateMaterialAnalysisData: TUpdateMaterialAnalysisData,
	user: string
) => {
	return await updateMaterialAnalysisService(id, updateMaterialAnalysisData, user);
};

export const deleteMaterialAnalysisUsecase = async (id: string, user: string) => {
	return await deleteMaterialAnalysis(id, user);
};
