import responses from "../../../../shared/utils/responses";
import { Request, Response, NextFunction } from "express";
import * as usecase from "../usecases/externalLabTestingReport.usecase";

export const createExternalLabTestingReport = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id || "system";
		const filePath = req.file
			? `/uploads/external-reports/${req.file.filename}`
			: "";

		const result = await usecase.createExternalLabTestingReportUsecase(
			{ ...req.body, uploadFile: filePath },
			user
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
		const user = req.user?.id || "system";
		const { id } = req.params;

		const filePath = req.file
			? `/uploads/external-reports/${req.file.filename}`
			: undefined;

		const result = await usecase.updateExternalLabTestingReportUsecase(
			id,
			{ ...req.body, ...(filePath ? { uploadFile: filePath } : {}) },
			user
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
