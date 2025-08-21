// import { TUploadFileResult } from "../../shared/fileUpload";
// import prisma, { IPrismaTransactionClient } from "../../shared/prisma";

// export interface ICreateFileServiceProps {
// 	file: TUploadFileResult;
// 	createdBy?: string;
// }

// export type TCreateFileServiceResponse = TUploadFileResult & { id: string };

// export const createFileService = async (
// 	props: ICreateFileServiceProps,
// 	tx: IPrismaTransactionClient | typeof prisma = prisma
// ): Promise<TCreateFileServiceResponse> => {
// 	const file = await tx.file.create({
// 		data: {
// 			name: props.file.originalname,
// 			path: props.file.key,
// 			size: props.file.size,
// 			mimeType: props.file.mimetype,
// 			createdById: props?.createdBy,
// 			location: props.file.location,
// 		},
// 		select: {
// 			id: true,
// 		},
// 	});
// 	return { ...props.file, id: file.id };
// };
