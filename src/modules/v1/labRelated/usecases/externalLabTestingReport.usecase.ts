import * as service from "../services/externalLabTestingReport.service";
import { TUploadFileResult } from "../../../../shared/fileUpload";
export const createExternalLabTestingReportUsecase = async (
	data: any,
	user: string,
	uploadedFileUrls: TUploadFileResult[]
) => await service.createExternalLabTestingReport(data, user, uploadedFileUrls);

export const getAllExternalLabTestingReportsUsecase = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string
) => {
	return await service.getAllExternalLabTestingReports(
		accessToken,
		pageNumber,
		pageSize
	);
};

export const getExternalLabTestingReportByIdUsecase = async (
	id: string,
	accessToken: string
) => {
	return await service.getExternalLabTestingReportById(id, accessToken);
};

export const updateExternalLabTestingReportUsecase = async (
	id: string,
	data: any,
	user: string,
	uploadedFileUrls: TUploadFileResult[]
) => {
	return await service.updateExternalLabTestingReport(
		id,
		data,
		user,
		uploadedFileUrls
	);
};
export const deleteExternalLabTestingReportUsecase = async (id: string) => {
	return await service.deleteExternalLabTestingReport(id);
};
