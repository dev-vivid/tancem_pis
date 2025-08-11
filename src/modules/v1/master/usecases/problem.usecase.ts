// problem.usecase.ts
import { 
  getAllProblems,
  getIdProblem,
  createProblem as createProblemService,
  updateProblem as updateProblemService,
  deleteProblem as deleteProblemService
} from "../services/problem.service";

// Get all problems use case
export const getAllProblemsUsecase = async (
  pageNumber?: string,
  pageSize?: string
) => {
  // const page = pageNumber ? parseInt(pageNumber, 10) : undefined;
  // const size = pageSize ? parseInt(pageSize, 10) : undefined;
  return await getAllProblems(pageNumber, pageSize);
};

// Get problem by ID use case
export const getIdProblemUsecase = async (id: string) => {
  return await getIdProblem(id);
};

// Problem data type for create/update
type TProblemData = {
  name: string;
  description?: string;
  departmentId: string;
  problem: string;
  sortOrder?: number;
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
  problemData: TProblemData,
  user: string
) => {
  return await updateProblemService(id, problemData, user);
};

// Delete (soft delete) problem use case
export const deleteProblemUsecase = async (id: string, user: string) => {
  return await deleteProblemService(id, user);
};
