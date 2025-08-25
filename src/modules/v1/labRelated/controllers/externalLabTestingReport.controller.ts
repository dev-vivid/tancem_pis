import responses from "../../../../shared/utils/responses";
import { Request, Response, NextFunction } from "express";
import * as usecase from "../usecases/externalLabTestingReport.usecase";
import { TUploadFileResult, uploadFiles } from "../../../../shared/fileUpload";

function filterFiles(
	files: Record<string, Express.Multer.File[]>,
	fields: string[]
) {
	return Object.keys(files)
		.filter((key) => fields.includes(key))
		.reduce((acc, key) => {
			acc[key] = files[key];
			return acc;
		}, {} as Record<string, Express.Multer.File[]>);
}

export const createExternalLabTestingReport = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id || "system";
		const files = (req.files as Record<string, Express.Multer.File[]>) || {};
		let uploadedFileUrls: TUploadFileResult[] = [];

		// ✅ Upload form1 files
		const form1Fields = ["labFileName"];
		const form1Files = filterFiles(files, form1Fields);
		if (Object.keys(form1Files).length > 0) {
			const urls = await uploadFiles("uploads/labFile", form1Files);
			uploadedFileUrls = [...uploadedFileUrls, ...urls];

			console.log(uploadedFileUrls);
		}

		const result = await usecase.createExternalLabTestingReportUsecase(
			{ ...req.body },
			user,
			uploadedFileUrls
		);

		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

export const getAllExternalLabTestingReports = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const result = await usecase.getAllExternalLabTestingReportsUsecase();
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

export const getExternalLabTestingReportById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res
				.status(400)
				.json({ code: "bad_request", message: "ID is required" });
		}
		const result = await usecase.getExternalLabTestingReportByIdUsecase(id);
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

export const updateExternalLabTestingReport = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const user = req.user?.id || "system";
		const files = (req.files as Record<string, Express.Multer.File[]>) || {};
		let uploadedFileUrls: TUploadFileResult[] = [];

		// ✅ Upload form1 files
		const form1Fields = ["labFileName"];
		const form1Files = filterFiles(files, form1Fields);
		if (Object.keys(form1Files).length > 0) {
			const urls = await uploadFiles("uploads/labFile", form1Files);
			uploadedFileUrls = [...uploadedFileUrls, ...urls];

			console.log(uploadedFileUrls);
		}

		const result = await usecase.updateExternalLabTestingReportUsecase(
			id,
			{ ...req.body },
			user,
			uploadedFileUrls
		);

		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};

export const deleteExternalLabTestingReport = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const result = await usecase.deleteExternalLabTestingReportUsecase(id);
		res.send(responses.generate("success", { data: result }));
	} catch (err) {
		next(err);
	}
};
