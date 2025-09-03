// problem.usecase.ts
import { Status } from "@prisma/client";
import { 
  getAllProblems,
  getIdProblem,
  createProblem as createProblemService,
  updateProblem as updateProblemService,
  deleteProblem as deleteProblemService
} from "../services/problem.service";

// Get all problems use case
export const getAllProblemsUsecase = async (
	accessToken: string,
  pageNumber?: string,
  pageSize?: string,
	status?: string
) => {
  // const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
  // const size = pageSize ? parseInt(pageSize, 10) : undefined;
  return await getAllProblems(accessToken, pageNumber, pageSize, status);
};

// Get problem by ID use case
export const getIdProblemUsecase = async (id: string, accessToken: string) => {
  return await getIdProblem(id, accessToken);
};

// Problem data type for create
type TProblemData = {
  name: string;
  description?: string;
  plantDepartmentId: string;
  problemDescription: string;
  sortOrder?: number;
};

// Problem data type for update
type TUpdateProblemData = {
  name: string;
  description?: string;
  plantDepartmentId: string;
  problemDescription: string;
  sortOrder?: number;
	status: Status;
};

// Create problem use case
export const createProblemUsecase = async (
  problemData: TProblemData,
  user: string
) => {
  return await createProblemService(problemData, user);
};

// Update problem use case
export const updateProblemUsecase = async (
  id: string,
  updateproblemData: TUpdateProblemData,
  user: string
) => {
  return await updateProblemService(id, updateproblemData, user);
};

// Delete (soft delete) problem use case
export const deleteProblemUsecase = async (id: string, user: string) => {
  return await deleteProblemService(id, user);
};
