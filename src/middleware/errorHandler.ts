import { ENV } from "@config/index";
import { AppError } from "@utils/errorHandler/appError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction // Make sure NextFunction is used!
): Response => {
	const stack = ENV === "production" ? {} : { stack: err?.stack };

	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			code: err.code,
			statusCode: err.statusCode,
			success: false,
			message: err.message,
			...stack,
		});
	}

	return res.status(500).json({
		code: "internalServerError",
		statusCode: 500,
		success: false,
		message: err.message || "An unexpected error occurred",
		...stack,
	});
};
