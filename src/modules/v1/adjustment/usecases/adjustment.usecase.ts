// src/modules/v1/master/usecases/adjustment.usecase.ts

import * as adjustmentService from "../services/adjustment.service";

// Get all adjustments
export const getAllAdjustmentsUsecase = async (
		accessToken: string,
	pageNumber?: string,
	pageSize?: string,
) => {
	return await adjustmentService.getAllAdjustments(accessToken, pageNumber, pageSize);
};

// Get adjustment by ID
export const getAdjustmentByIdUsecase = async (id: string, accessToken: string) => {
	return await adjustmentService.getAdjustmentById(id,accessToken);
};


// Create adjustment
export const createAdjustmentUsecase = async (
	adjustmentData: any,
	userId: string
) => {
	return await adjustmentService.createAdjustment(adjustmentData, userId);
};

// Update adjustment
export const updateAdjustmentUsecase = async (
	id: string,
	payload: any,
	userId: string
) => {
	return await adjustmentService.updateAdjustment(id, payload, userId);
};

// Delete adjustment
export const deleteAdjustmentUsecase = async (id: string, userId: string) => {
	return await adjustmentService.deleteAdjustment(id, userId);
};
