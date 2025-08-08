// // src/upload.ts
// import { S3Client } from "@aws-sdk/client-s3";
// import multer from "multer";
// import multerS3 from "multer-s3";
// import { Request } from "express";
// import {
// 	AWS_ACCESS_KEY,
// 	AWS_REGION,
// 	AWS_S3_BUCKET,
// 	AWS_SECRET_KEY,
// } from "../../config";

// // S3 configuration
// const s3 = new S3Client({
// 	credentials: {
// 		accessKeyId: AWS_ACCESS_KEY, // from IAM
// 		secretAccessKey: AWS_SECRET_KEY,
// 	},
// 	region: AWS_REGION, // or your region
// });

// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// const uploadFileToS3 = async (file: Express.Multer.File, folder = "") => {
// 	const key = `${folder}/${uuidv4()}_${file.originalname}`;

// 	const command = new PutObjectCommand({
// 		Bucket: AWS_S3_BUCKET,
// 		Key: key,
// 		Body: file.buffer,
// 		ContentType: file.mimetype,
// 	});

// 	await s3.send(command);

// 	return {
// 		location: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`,
// 		key: key,
// 		size: file.size,
// 		mimetype: file.mimetype,
// 		originalname: file.originalname,
// 	};
// };

// export default uploadFileToS3;
