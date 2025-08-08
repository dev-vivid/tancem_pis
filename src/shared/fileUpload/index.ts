import uploadFileToLocal from "./uploadOnLocal.service";

export type TUploadFileResult = {
	name: string;
	location: string;
	key: string;
	size: number;
	mimetype: string;
	originalname: string;
};
export const uploadFile = uploadFileToLocal;

export async function uploadFiles(
	folder: string,
	files: Record<string, Express.Multer.File[]>
): Promise<TUploadFileResult[]> {
	const uploadedFileResult: TUploadFileResult[] = [];
	if (files && Object.keys(files).length > 0) {
		for (const fieldName in files) {
			for (const file of files[fieldName]) {
				const fileResult = await uploadFile(file, folder);
				uploadedFileResult.push({ ...fileResult, name: fieldName });
			}
		}
	}
	return uploadedFileResult;
}
