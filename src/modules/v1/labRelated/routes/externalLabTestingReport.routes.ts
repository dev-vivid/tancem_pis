import { Router } from "express";
import {
	createExternalLabTestingReport,
	getAllExternalLabTestingReports,
	getExternalLabTestingReportById,
	updateExternalLabTestingReport,
	deleteExternalLabTestingReport,
} from "../controllers/externalLabTestingReport.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import { uploadFields } from "@utils/general";
import { uploadFiles } from "@shared/fileUpload";
import uploadFileToLocal from "@shared/fileUpload/uploadOnLocal.service";
import { getUploadObj } from "@utils/files";

// import { upload } from "../../../middleware/upload"; // multer middleware

export const externalLabTestingReportRouter = Router();

// Create
externalLabTestingReportRouter.post(
	"/labTestingReportAdd",
	getUploadObj().fields([{ name: "labFileName", maxCount: 1 }]),
	createExternalLabTestingReport
);

// Get all
externalLabTestingReportRouter.get(
	"/labTestingReportViewAll",
	getAllExternalLabTestingReports
);

// Get by ID
externalLabTestingReportRouter.get(
	"/labTestingReportViewById/:id",
	getExternalLabTestingReportById
);

// Update
externalLabTestingReportRouter.put(
	"/labTestingReportEdit/:id",
	getUploadObj().fields([{ name: "labFileName", maxCount: 1 }]),
	updateExternalLabTestingReport
);

// Delete
externalLabTestingReportRouter.patch(
	"/labTestingReportDelete/:id",
	deleteExternalLabTestingReport
);

export default externalLabTestingReportRouter;
