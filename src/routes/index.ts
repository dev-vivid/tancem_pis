import { Router } from "express";
import { baseAuth } from "@middleware/auth";

import analysisRouter from "@module/v1/master/routes/analysis.routes";

const routes = Router();

routes.use(``, [baseAuth], analysisRouter);

export { routes as apiV1Routes };
