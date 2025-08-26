import {
	getAllBudgets,
	getBudgetById,
	createBudget,
	updateBudget,
	deleteBudget,
} from "../services/budget.service";

export const getAllBudgetsUsecase = async (
	pageNumber?: string,
	pageSize?: string
) => {
	return await getAllBudgets(pageNumber, pageSize);
};

export const getBudgetByIdUsecase = async (id: string) => {
	return await getBudgetById(id);
};

export const createBudgetUsecase = async (
	budgetData: {
		financialYear: string;
		transactionDate: Date;
		materialId: string;
		budgetCode: string;
		budgetValue: number;
	},
	user: string
) => {
	return await createBudget(budgetData, user);
};

export const updateBudgetUsecase = async (
	id: string,
	budgetData: Partial<{
		financialYear: string;
		transactionDate: Date;
		materialId: string;
		budgetCode: string;
		budgetValue: number;
	}>,
	user: string
) => {
	return await updateBudget(id, budgetData, user);
};

export const deleteBudgetUsecase = async (id: string, user: string) => {
	return await deleteBudget(id, user);
};
