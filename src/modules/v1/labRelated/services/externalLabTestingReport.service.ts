import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { TUploadFileResult } from "../../../../shared/fileUpload";
import { extractDateTime, parseDateOnly } from "../../../../shared/utils/date";
import { UPLOAD_PATH, BASE_URL, BASE_PATH } from "../../../../config";
import getUserData from "@shared/prisma/queries/getUserById";
import { getMaterialName } from "common/api";
import { Prisma } from "@prisma/client";

export const createExternalLabTestingReport = async (
	data: {
		transactionDate: string;
		despatchDate: string;
		reportReceivedDate: string;
		testingType: string;
		quantitySent?: number | string;
		materialId: string;
		thirdPartyVendorName: string;
		remarks: string;
	},
	user: string,
	files: TUploadFileResult[],
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const result = await tx.externalLabTestingReport.create({
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			despatchDate: parseDateOnly(data.despatchDate),
			reportReceivedDate: parseDateOnly(data.reportReceivedDate),
			quantitySent: data.quantitySent ?? null,
			testingType: data.testingType,
			materialId: data.materialId,
			thirdPartyVendorName: data.thirdPartyVendorName,
			remarks: data.remarks,
			labUploadFilesJson: files.length > 0 ? files : Prisma.JsonNull,
			createdById: user,
		},
	});

	return result;
};

export const getAllExternalLabTestingReports = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const reports = await tx.externalLabTestingReport.findMany({
		skip,
		take,
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
	});

	const formattedReports = [];
	for (const report of reports) {
		const materialName =
			report.materialId && accessToken
				? await getMaterialName(report.materialId, accessToken)
				: null;
		const createdUser = report.createdById
			? await getUserData(report.createdById)
			: null;
		const updatedUser = report.updatedById
			? await getUserData(report.updatedById)
			: null;

		// Create base report data without file-specific fields
		const baseReportData = {
			uuid: report.id,
			code: report.code,
			transactionDate: extractDateTime(report.transactionDate, "date"),
			despatchDate: extractDateTime(report.despatchDate, "date"),
			reportReceivedDate: extractDateTime(report.reportReceivedDate, "date"),
			testingType: report.testingType,
			quantitySent: report.quantitySent ? Number(report.quantitySent) : null,
			materialId: report.materialId,
			materialName: materialName ? materialName.name : null,
			thirdPartyVendorName: report.thirdPartyVendorName,
			remarks: report.remarks,
			createdAt: extractDateTime(report.createdAt, "both"),
			updatedAt: extractDateTime(report.updatedAt, "both"),
			createdById: report.createdById,
			updatedById: report.updatedById,
			createdUser: createdUser?.userName,
			updatedUser: updatedUser?.userName,
		};

		// Handle files from JSON field
		const filesJson = report.labUploadFilesJson as TUploadFileResult[] | null;
		if (filesJson && Array.isArray(filesJson) && filesJson.length > 0) {
			filesJson.forEach((file: TUploadFileResult) => {
				formattedReports.push({
					...baseReportData,
					labUploadFileUrl: file.location
						? `${BASE_URL}/${BASE_PATH}/${file.location.replace(/\\/g, "/")}`
						: null,
					fileName: file.originalname,
				});
			});
		} else {
			// Add the report even if there are no files
			formattedReports.push({
				...baseReportData,
				labUploadFileUrl: null,
				fileName: null,
			});
		}
	}

	return formattedReports;
};

export const getExternalLabTestingReportById = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const report = await tx.externalLabTestingReport.findUnique({
		where: { id },
	});

	if (!report) return null;

	const materialName =
		report.materialId && accessToken
			? await getMaterialName(report.materialId, accessToken)
			: null;

	const createdUser = report.createdById
		? await getUserData(report.createdById)
		: null;
	const updatedUser = report.updatedById
		? await getUserData(report.updatedById)
		: null;

	// Base report data
	const baseReportData = {
		uuid: report.id,
		code: report.code,
		transactionDate: extractDateTime(report.transactionDate, "date"),
		despatchDate: extractDateTime(report.despatchDate, "date"),
		reportReceivedDate: extractDateTime(report.reportReceivedDate, "date"),
		testingType: report.testingType,
		quantitySent: report.quantitySent ? Number(report.quantitySent) : null,
		materialId: report.materialId,
		materialName: materialName ? materialName.name : null,
		thirdPartyVendorName: report.thirdPartyVendorName,
		remarks: report.remarks,
		createdAt: extractDateTime(report.createdAt, "both"),
		updatedAt: extractDateTime(report.updatedAt, "both"),
		createdById: report.createdById,
		updatedById: report.updatedById,
		createdUser: createdUser?.userName,
		updatedUser: updatedUser?.userName,
	};

	// Format files array with role info
	const filesJson = (report.labUploadFilesJson as TUploadFileResult[]) || [];
	const formattedFiles = await Promise.all(
		filesJson.map(async (file) => {
			const userData = report.createdById
				? await getUserData(report.createdById)
				: null;
			return {
				filename: file.originalname,
				url: file.location
					? `${BASE_URL}/${BASE_PATH}/${file.location.replace(/\\/g, "/")}`
					: null,
				role: userData?.roleName || null,
			};
		})
	);

	// Return base report and files array
	return {
		...baseReportData,
		files: formattedFiles,
	};
};

export const updateExternalLabTestingReport = async (
	id: string,
	data: any,
	user: string,
	files: TUploadFileResult[],
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const existing = await tx.externalLabTestingReport.findUnique({
		where: { id },
	});

	if (!existing) {
		throw new Error(`data not found`);
	}

	const existingFiles =
		(existing.labUploadFilesJson as TUploadFileResult[]) || [];
	const updatedFiles = [...existingFiles, ...files];

	return await tx.externalLabTestingReport.update({
		where: { id },
		data: {
			transactionDate: parseDateOnly(data.transactionDate),
			despatchDate: parseDateOnly(data.despatchDate),
			reportReceivedDate: parseDateOnly(data.reportReceivedDate),
			testingType: data.testingType,
			quantitySent: data.quantitySent ?? null,
			materialId: data.materialId,
			thirdPartyVendorName: data.thirdPartyVendorName,
			remarks: data.remarks,
			labUploadFilesJson:
				updatedFiles.length > 0 ? updatedFiles : Prisma.JsonNull,
			updatedById: user,
		},
	});
};

export const deleteExternalLabTestingReport = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.update({
		where: { id },
		data: { isActive: false },
	});
};
