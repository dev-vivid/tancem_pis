import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { TUploadFileResult } from "../../../../shared/fileUpload";
import { parseDateOnly } from "../../../../shared/utils/date";
import { UPLOAD_PATH, BASE_URL, BASE_PATH } from "../../../../config";
export const createExternalLabTestingReport = async (
	data: {
		transactionDate: string;
		despatchDate: string;
		reportReceivedDate: string;
		testingType: string;
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
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	return await tx.externalLabTestingReport.findMany({
		where: { isActive: true },
		orderBy: { createdAt: "desc" },
	});
};

export const getExternalLabTestingReportById = async (
	id: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	// return await tx.externalLabTestingReport.findUnique({ where: { id } });
	const report = await tx.externalLabTestingReport.findUnique({
		where: { id },
	});

	if (!report) return null;

	return {
		...report,
		labUploadFileUrl: report.labUploadFile
			? `${BASE_URL}/${BASE_PATH}/${report.labUploadFile.replace(/\\/g, "/")}`
			: null,
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
			...data,
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
		data: { isActive: false }, // soft delete
	});
};
