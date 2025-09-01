import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAllMaterialAnalysisUsecase, getIdMaterialAnalysisUsecase, createMaterialAnalysisUsecase, updateMaterialAnalysisUsecase, deleteMaterialAnalysisUsecase } 
from "../usecases/materialAnalysis.usecase";

export const getAllMaterialAnalysis = async (req: Request, res: Response, next: NextFunction) => {
 try {

	const { pageNumber, pageSize, status } = req.query;
	const authHeader = req.headers.authorization;
		
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Unauthorized: No access token provided" });
	}
	const accessToken = authHeader.split(" ")[1];		
	const result = await getAllMaterialAnalysisUsecase(
		accessToken,
		pageNumber as string | undefined,
		pageSize as string | undefined,
		status as string | undefined
	);
	const response = responses.generate("success", {
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const getIdMaterialAnalysis = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const { id } = req.params;
	const result = await getIdMaterialAnalysisUsecase(id);

	const response = responses.generate("success", {
		data: result,
	});
	
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const createMaterialAnalysis = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const user = req.user?.id;
	if(!user){
		return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
		});
	}
	const problemData = req.body;
	const result = await createMaterialAnalysisUsecase(problemData, user);

	let response = responses.generate("success", {
		data: result,
	});
	response.message = "Material Analysis has been created"
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const updateMaterialAnalysis = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const user = req.user?.id;
	if(!user){
		return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
		});
	}	
	const {id } = req.params;
	const updateData = req.body;

	const result = await updateMaterialAnalysisUsecase(id, updateData, user);

	const response = responses.generate("success", {
		message: "Material Analysis has been updated",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const deleteMaterialAnalysis = async (req: Request, res: Response, next: NextFunction) => {
 try {

	const {id} = req.params;

	const user = req.user?.id;
	if(!user){
		return res.status(401).json({
				code: "unauthorized",
				statusCode: 401,
				success: false,
				message: "User is not authenticated",
			});
	}
	const result = await deleteMaterialAnalysisUsecase(id, user);

	const response = responses.generate("success", {
		message: "Material Analysis has been deleted",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};
