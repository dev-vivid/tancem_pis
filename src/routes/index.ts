import { Router } from "express";
import { baseAuth } from "@middleware/auth";

import analysisRouter from "@module/v1/master/routes/analysis.routes";
import problemCodeRouter from "@module/v1/master/routes/problemCode.routes";
import problemRouter from "@module/v1/master/routes/problem.routes";

const routes = Router();

routes.use(``, [baseAuth], analysisRouter);
routes.use(``, [baseAuth], problemCodeRouter);
routes.use(/problem, [baseAuth], problemRouter);
export { routes as apiV1Routes };
