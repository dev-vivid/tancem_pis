import { Request, Response, NextFunction } from "express";
import {
	getAllMaterialTypeMasterUsecase,
	getIdMaterialTypeMasterUsecase,
	createMaterialTypeMasterUsecase,
	updateMaterialTypeMasterUsecase,
	deleteMaterialTypeMasterUsecase,
} from "../usecases/materialTypeMaster.usecase";
import { Status } from "@prisma/client";
import responses from "../../../../shared/utils/responses";

export const getAllMaterialTypeMaster = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { status, pageNumber, pageSize } = req.query as {
			status?: string;
			pageNumber?: string;
			pageSize?: string;
		};

		// 👇 Convert string to Prisma Status (if provided)
		const parsedStatus = status as Status | undefined;

		const result = await getAllMaterialTypeMasterUsecase(
			parsedStatus!,
			pageNumber,
			pageSize
		);
		const response = responses.generate("success", {
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getMaterialTypeMasterById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const result = await getIdMaterialTypeMasterUsecase(id);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createMaterialTypeMaster = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id;
		const result = await createMaterialTypeMasterUsecase(req.body, user);

		const response = responses.generate("success", { data: result });
		res.status(201).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateMaterialTypeMaster = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const user = req.user?.id || "system";
		const result = await updateMaterialTypeMasterUsecase(id, req.body, user);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteMaterialTypeMaster = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const user = req.user?.id || "system";
		const result = await deleteMaterialTypeMasterUsecase(id, user);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
