import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { TUploadFileResult } from "../../../../shared/fileUpload";
import { extractDateTime, parseDateOnly } from "../../../../shared/utils/date";
import { UPLOAD_PATH, BASE_URL, BASE_PATH } from "../../../../config";
import getUserData from "@shared/prisma/queries/getUserById";
import { getMaterialName } from "common/api";

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
	let labFile: string | null = null;
	if (files && files.length > 0) {
		labFile = files[0].location;
	}
	// console.log(data);
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
			labUploadFile: labFile,
			createdById: user,
		},
	});

	// return result;
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

		formattedReports.push({
			uuid: report.id,
			transactionDate: extractDateTime(report.transactionDate, "date"),
			despatchDate: extractDateTime(report.despatchDate, "date"),
			reportReceivedDate: extractDateTime(report.reportReceivedDate, "date"),
			testingType: report.testingType,
			quantitySent: report.quantitySent ? Number(report.quantitySent) : null,
			materialId: report.materialId,
			materialName: materialName ? materialName.name : null,
			thirdPartyVendorName: report.thirdPartyVendorName,
			remarks: report.remarks,
			labUploadFileUrl: report.labUploadFile
				? `${BASE_URL}/${BASE_PATH}/${report.labUploadFile.replace(/\\/g, "/")}`
				: null,
			createdAt: extractDateTime(report.createdAt, "both"),
			updatedAt: extractDateTime(report.updatedAt, "both"),
			createdById: report.createdById,
			updatedById: report.updatedById,
			createdUser,
			updatedUser,
		});
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

	return {
		uuid: report.id,
		transactionDate: extractDateTime(report.transactionDate, "date"),
		despatchDate: extractDateTime(report.despatchDate, "date"),
		reportReceivedDate: extractDateTime(report.reportReceivedDate, "date"),
		testingType: report.testingType,
		quantitySent: report.quantitySent ? Number(report.quantitySent) : null,
		materialId: report.materialId,
		materialName: materialName ? materialName.name : null,
		thirdPartyVendorName: report.thirdPartyVendorName,
		remarks: report.remarks,
		labUploadFileUrl: report.labUploadFile
			? `${BASE_URL}/${BASE_PATH}/${report.labUploadFile.replace(/\\/g, "/")}`
			: null,
		createdAt: extractDateTime(report.createdAt, "both"),
		updatedAt: extractDateTime(report.updatedAt, "both"),
		createdById: report.createdById,
		updatedById: report.updatedById,
		createdUser,
		updatedUser,
	};
};

export const updateExternalLabTestingReport = async (
	id: string,
	data: any,
	user: string,
	files: TUploadFileResult[],
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	let labFile: string | null = null;
	if (files && files.length > 0) {
		labFile = files[0].location;
		// labFile = files[0].key;
	}
	const existing = await tx.externalLabTestingReport.findUnique({
		where: { id },
	});

	if (!existing) {
		throw new Error(`data not found`);
	}

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
			labUploadFile: labFile ?? data.labUploadFile, // update if new file, else keep old
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
