import express from "express";
import {
	getAllreceipt,
	getIdreceipt,
	createreceipt,
	updatereceipt,
	deletereceipt,
} from "../controllers/receipt.controller";
import { validateRequest } from "../../../../middleware/validateRequest";
import {
	receiptFilterQuerySchema,
	receiptFormSchema,
	receiptCreateFormSchema,
} from "../validations/receipt.schema";

const receiptRouter = express.Router();

receiptRouter.get(
	"/receipt",
	validateRequest(receiptFilterQuerySchema, "query"),
	getAllreceipt
);
receiptRouter.get("/receipt/:id", getIdreceipt);

receiptRouter.post(
	"/receiptAdd",
	validateRequest(receiptCreateFormSchema, "body"),
	createreceipt
);

receiptRouter.put(
	"/receiptEdit/:id",
	validateRequest(receiptFormSchema, "body"),
	updatereceipt
);

receiptRouter.patch("/deleteReceipt/:id", deletereceipt);

export default receiptRouter;
