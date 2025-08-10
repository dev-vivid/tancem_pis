import { Router } from "express";
import { baseAuth } from "@middleware/auth";

import analysisRouter from "@module/v1/master/routes/analysis.routes";
import problemCodeRouter from "@module/v1/master/routes/problemCode.routes";

const routes = Router();

routes.use(``, [baseAuth], analysisRouter);
routes.use(``, [baseAuth], problemCodeRouter);

export { routes as apiV1Routes };
