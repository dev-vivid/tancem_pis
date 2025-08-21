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
import adjustmentRouter from "@module/v1/adjustment/routes/adjustment.routes";
import powerRouter from "@module/v1/power/routes/power.routes";
import bagsRouter from "@module/v1/bags/routes/bags.routes";
import stoppageRouter from "@module/v1/stoppage/routes/stoppage.routes";
import materialAnalysisRouter from "@module/v1/master/routes/materialAnalysis.routes";
import materialTypeRouter from "@module/v1/master/routes/materialType.routes";
import annualMaterialBudgetRouter from "@module/v1/master/routes/annualMaterialBudget.routes";
import analysisLabRouter from "@module/v1/labRelated/routes/analysisLab.routes";
import qualityLabRouter from "@module/v1/labRelated/routes/qualityLab.routes";
import despatchRouter from "@module/v1/productionRelated/routes/despatch.routes";
import productionRouter from "@module/v1/productionRelated/routes/production.routes";
import receiptRouter from "@module/v1/productionRelated/routes/receipt.routes";

routes.use(``, [baseAuth], analysisRouter);
routes.use(``, [baseAuth], problemCodeRouter);
routes.use(``, [baseAuth], problemRouter);
routes.use(``, [baseAuth], equipmentRouter);
routes.use(``, [baseAuth], subEquipmentRouter);
routes.use(``, [baseAuth], productionCategoryRouter);
routes.use(``, [baseAuth], materialTypeMasterRouter);
routes.use(``, [baseAuth], transactionTypeRouter);
routes.use(``, [baseAuth], adjustmentRouter);
routes.use(``, [baseAuth], powerRouter);
routes.use(``, [baseAuth], bagsRouter);
routes.use(``, [baseAuth], stoppageRouter);
routes.use(``, [baseAuth], materialAnalysisRouter);
routes.use(``, [baseAuth], materialTypeRouter);
routes.use(``, [baseAuth], annualMaterialBudgetRouter);
routes.use(``, [baseAuth], analysisLabRouter);
routes.use(``, [baseAuth], qualityLabRouter);
routes.use(``, [baseAuth], despatchRouter);
routes.use(``, [baseAuth], productionRouter);
routes.use(``, [baseAuth], receiptRouter);

export { routes as apiV1Routes };
