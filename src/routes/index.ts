import { Router } from "express";
import { baseAuth } from "@middleware/auth";

const routes = Router();

import analysisRouter from "@module/v1/master/routes/analysis.routes";
import problemCodeRouter from "@module/v1/master/routes/problemCode.routes";
import problemRouter from "@module/v1/master/routes/problem.routes";
import equipmentRouter from "@module/v1/master/routes/equipment.routes";
import subEquipmentRouter from "@module/v1/master/routes/subEquipment.routes";
import productionCategoryRouter from "@module/v1/master/routes/productionCategory.routes";
import materialTypeMasterRouter from "@module/v1/master/routes/materialTypeMaster.routes";
import transactionTypeRouter from "@module/v1/master/routes/transactionType.routes";
import AdjustmentRouter from "@module/v1/Adjustment/routes/Adjustment.routes";
import powerRouter from "@module/v1/power/routes/power.routes";
import bagsRouter from "@module/v1/bags/routes/bags.routes";
import stoppageRouter from "@module/v1/stoppage/routes/stoppage.routes";
import materialAnalysisRouter from "@module/v1/master/routes/materialAnalysis.routes";
import materialTypeRouter from "@module/v1/master/routes/materialType.routes";
import annualMaterialBudgetRouter from "@module/v1/master/routes/annualMaterialBudget.routes";

routes.use(``, [baseAuth], analysisRouter);
routes.use(``, [baseAuth], problemCodeRouter);
routes.use(``, [baseAuth], problemRouter);
routes.use(``, [baseAuth], equipmentRouter);
routes.use(``, [baseAuth], subEquipmentRouter);
routes.use(``, [baseAuth], productionCategoryRouter);
routes.use(``, [baseAuth], materialTypeMasterRouter);
routes.use(``, [baseAuth], transactionTypeRouter);
routes.use(``, [baseAuth], AdjustmentRouter);
routes.use(``, [baseAuth], powerRouter);
routes.use(``, [baseAuth], bagsRouter);
routes.use(``, [baseAuth], stoppageRouter);
routes.use(``, [baseAuth], materialAnalysisRouter);
routes.use(``, [baseAuth], materialTypeRouter);
routes.use(``, [baseAuth], annualMaterialBudgetRouter);

export { routes as apiV1Routes };
