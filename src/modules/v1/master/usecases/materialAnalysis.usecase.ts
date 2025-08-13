import { 
	createMaterialAnalysis as createMaterialAnalysisService,
	updateMaterialAnalysis as updateMaterialAnalysisService,
	getAllMaterialAnalysis as getAllService,
	deleteMaterialAnalysis as deleteMaterialAnalysis,
	getByID as getByIdService,
} from "../services/materialAnalysis.service";

export const getAllMaterialAnalysisUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAllService(pageNumber, pageSize);
};

export const getIdMaterialAnalysisUsecase = async (id: string) => {
	return await getByIdService(id);
};

//material analysis data type for create/update
type TMaterialAnalysisData = {
	materialId: string;
	analysisId: string;
};

export const createMaterialAnalysisUsecase = async (
	materialAnalysisData: TMaterialAnalysisData,
	user: string
) => {
	return await createMaterialAnalysisService(materialAnalysisData, user);
};

export const updateMaterialAnalysisUsecase = async (
	id: string,
	materialAnalysisData: TMaterialAnalysisData,
	user: string
) => {
	return await updateMaterialAnalysisService(id, materialAnalysisData, user);
};

export const deleteMaterialAnalysisUsecase = async (id: string, user: string) => {
	return await deleteMaterialAnalysis(id, user);
};
