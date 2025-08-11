import express from "express";
import { validateRequest } from "@middleware/validateRequest";
import { problemFilterQuerySchema, createProblemBodySchema, updateProblemBodySchema, updateProblemParamsSchema, deleteProblemParamsSchema, getProblemParamsSchema } 
from "../validations/problem.schema";
import { getAllProblem, getProblemById, createProblem, updateProblem, deleteProblem } from "../controllers/problem.controller";

const problemRouter = express.Router();

problemRouter.get(
 "/allProblems",
 validateRequest(problemFilterQuerySchema, "query"),
 getAllProblem
);

problemRouter.get(
 "/problemById/:id",
 validateRequest(getProblemParamsSchema, "params"),
 getProblemById
);

problemRouter.post(
 "/problemAdd",
 validateRequest(createProblemBodySchema),
 createProblem
);

problemRouter.put(
 "/problemUpdate/:id",
 validateRequest(updateProblemParamsSchema, "params"),
 validateRequest(updateProblemBodySchema, "body"),
 updateProblem
);

problemRouter.patch(
 "/deleteProblem",
 validateRequest(deleteProblemParamsSchema, "params"),
 deleteProblem
);

export default problemRouter;
