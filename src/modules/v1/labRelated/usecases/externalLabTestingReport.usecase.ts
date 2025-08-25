import * as service from "../services/externalLabTestingReport.service";
import { TUploadFileResult } from "../../../../shared/fileUpload";
export const createExternalLabTestingReportUsecase = async (
	data: any,
	user: string,
	uploadedFileUrls: TUploadFileResult[]
) => await service.createExternalLabTestingReport(data, user, uploadedFileUrls);

export const getAllExternalLabTestingReportsUsecase = async () =>
	await service.getAllExternalLabTestingReports();

export const getExternalLabTestingReportByIdUsecase = async (id: string) =>
	await service.getExternalLabTestingReportById(id);

export const updateExternalLabTestingReportUsecase = async (
	id: string,
	data: any,
	user: string,
	uploadedFileUrls: TUploadFileResult[]
) =>
	await service.updateExternalLabTestingReport(
		id,
		data,
		user,
		uploadedFileUrls
	);

export const deleteExternalLabTestingReportUsecase = async (id: string) =>
	await service.deleteExternalLabTestingReport(id);
