import { Router } from "express";
import {
	createExternalLabTestingReport,
	getAllExternalLabTestingReports,
	getExternalLabTestingReportById,
	updateExternalLabTestingReport,
	deleteExternalLabTestingReport,
} from "../controllers/externalLabTestingReport.controller";
import { validateRequest } from "../../../../middleware/validateRequest";

// import { upload } from "../../../middleware/upload"; // multer middleware

export const externalLabTestingReportRouter = Router();

// Create
// externalLabTestingReportRouter.post(
// 	"/externalLabTestingReportAdd",
// 	upload.single("file"),
// 	createExternalLabTestingReport
// );

// Get all
externalLabTestingReportRouter.get(
	"/externalLabTestingReportList",
	getAllExternalLabTestingReports
);

// Get by ID
externalLabTestingReportRouter.get(
	"/externalLabTestingReportById/:id",
	getExternalLabTestingReportById
);

// Update
// externalLabTestingReportRouter.put(
// 	"/externalLabTestingReportEdit/:id",
// 	upload.single("file"),
// 	updateExternalLabTestingReport
// );

// Delete
externalLabTestingReportRouter.patch(
	"/externalLabTestingReportDelete/:id",
	deleteExternalLabTestingReport
);

export default externalLabTestingReportRouter;
