import { 
  getAllTransactionTypes, 
  getTransactionTypeById, 
  createTransactionType, 
  updateTransactionType, 
  deleteTransactionType 
} from "../services/transactionType.service";

// Usecase: Get all transaction types with optional pagination
export const getAllTransactionTypesUsecase = async (
  pageNumber?: string,
  pageSize?: string
) => {
  // Converts pageNumber and pageSize to numbers (if provided)
  const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
  const size = pageSize ? parseInt(pageSize, 10) : undefined;
  return await getAllTransactionTypes(page, size);
};

// Usecase: Get a transaction type by ID
export const getTransactionTypeByIdUsecase = async (id: string) => {
  return await getTransactionTypeById(id);
};

// Input data type
type TTransactionTypeData = {
  name: string;
};

// Usecase: Create a transaction type
export const createTransactionTypeUsecase = async (
  transactionTypeData: TTransactionTypeData,
  userId: string
) => {
  return await createTransactionType(transactionTypeData, userId);
};

// Usecase: Update a transaction type
export const updateTransactionTypeUsecase = async (
  id: string,
  transactionTypeData: TTransactionTypeData,
  userId: string
) => {
  return await updateTransactionType(id, transactionTypeData, userId);
};

// Usecase: Delete a transaction type
export const deleteTransactionTypeUsecase = async (
  id: string,
  userId: string
) => {
  return await deleteTransactionType(id, userId);
};
