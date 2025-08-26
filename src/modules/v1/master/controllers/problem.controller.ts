import { Request, Response, NextFunction } from "express";
import responses from "../../../../shared/utils/responses";

import { getAllProblemsUsecase, getIdProblemUsecase, createProblemUsecase, updateProblemUsecase, deleteProblemUsecase } from "../usecases/problem.usecase";


export const getAllProblem = async (req: Request, res: Response, next: NextFunction) => {
 try {

	const { pageNumber, pageSize, status } = req.query;
	const result = await getAllProblemsUsecase(
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

export const getProblemById = async (req: Request, res: Response, next: NextFunction) => {
 try {
	const { id } = req.params;
	const result = await getIdProblemUsecase(id);

	const response = responses.generate("success", {
		data: result,
	});
	
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const createProblem = async (req: Request, res: Response, next: NextFunction) => {
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
	const result = await createProblemUsecase(problemData, user);

	let response = responses.generate("success", {
		data: result,
	});
	response.message = "Problem has been created"
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const updateProblem = async (req: Request, res: Response, next: NextFunction) => {
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

	const result = await updateProblemUsecase(id, updateData, user);

	const response = responses.generate("success", {
		message: "Problem has been updated",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};

export const deleteProblem = async (req: Request, res: Response, next: NextFunction) => {
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
	const result = await deleteProblemUsecase(id, user);

	const response = responses.generate("success", {
		message: "Problem has been deleted",
		data: result,
	});
	res.status(response.statusCode).send(response);
 } catch (error) {
	next(error)
 }
};
