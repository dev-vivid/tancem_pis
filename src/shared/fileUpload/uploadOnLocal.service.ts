import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_PATH } from "../../config"; // Your env-configured base path

const uploadFileToLocal = async (file: Express.Multer.File, folder = "") => {
	const uploadDir = path.join(UPLOAD_PATH, folder);

	// Ensure the target folder exists
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir, { recursive: true });
	}

	const fileName = `${uuidv4()}_${file.originalname}`;
	const filePath = path.join(uploadDir, fileName);

	// Write the file to disk
	await fs.promises.writeFile(filePath, file.buffer);

	return {
		location: filePath,
		key: path.relative(UPLOAD_PATH, filePath),
		size: file.size,
		mimetype: file.mimetype,
		originalname: file.originalname,
	};
};

export default uploadFileToLocal;
