import multer from "multer";
import { getFileExtension } from "../general";
import path from "path";
import { UPLOAD_PATH } from "../../../config";

export const getStorage = () =>
	multer.diskStorage({
		destination: UPLOAD_PATH,
		filename: function (req, file, cb) {
			const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
			cb(
				null,
				path.parse(file.originalname).name +
					"_" +
					uniqueSuffix +
					"." +
					getFileExtension(file.originalname)
			);
		},
	});

export let getUploadObj = () => multer({ storage: getStorage() });
