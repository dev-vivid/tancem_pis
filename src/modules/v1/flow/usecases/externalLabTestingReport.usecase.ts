import * as service from "../services/externalLabTestingReport.service";

export const createExternalLabTestingReportUsecase = async (
	data: any,
	user: string
) => await service.createExternalLabTestingReport(data, user);

export const getAllExternalLabTestingReportsUsecase = async () =>
	await service.getAllExternalLabTestingReports();

export const getExternalLabTestingReportByIdUsecase = async (id: string) =>
	await service.getExternalLabTestingReportById(id);

export const updateExternalLabTestingReportUsecase = async (
	id: string,
	data: any,
	user: string
) => await service.updateExternalLabTestingReport(id, data, user);

export const deleteExternalLabTestingReportUsecase = async (id: string) =>
	await service.deleteExternalLabTestingReport(id);
