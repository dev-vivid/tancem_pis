import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";
import {
	getAllMappingsUsecase,
	getMappingByIdUsecase,
	createMappingUsecase,
	updateMappingUsecase,
	deleteMappingUsecase,
} from "../usecases/equipmentOutputMaterialMapping.usecase";

export const getAllMapping = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { pageNumber, pageSize, status } = req.query;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];

		const result = await getAllMappingsUsecase(
			accessToken,
			pageNumber as string | undefined,
			pageSize as string | undefined,
			status as string | undefined
		);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const getMappingByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id } = req.params;
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No access token provided" });
		}
		const accessToken = authHeader.split(" ")[1];

		const result = await getMappingByIdUsecase(id, accessToken);

		const response = responses.generate("success", { data: result });
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const createMapping = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id;
		if (!user) return res.status(401).json({ message: "Unauthorized" });
		const problemData = req.body;

		const result = await createMappingUsecase(problemData, user);
		const response = responses.generate("success", {
			message: "Mapping created",
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const updateMapping = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id;
		if (!user) return res.status(401).json({ message: "Unauthorized" });

		const { id } = req.params;
		const result = await updateMappingUsecase(id, req.body, user);

		const response = responses.generate("success", {
			message: "Mapping updated",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};

export const deleteMapping = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user?.id;
		if (!user) return res.status(401).json({ message: "Unauthorized" });

		const { id } = req.params;
		const result = await deleteMappingUsecase(id, user);

		const response = responses.generate("success", {
			message: "Mapping deleted",
			data: result,
		});
		res.status(response.statusCode).send(response);
	} catch (error) {
		next(error);
	}
};
