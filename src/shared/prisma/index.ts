import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

// const prisma = new PrismaClient();


export type IPrismaTransactionClient = Omit<
	PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	"$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
const prisma = new PrismaClient()
// .$extends({
// 	query: {
// 		async $allOperations({ model, operation, args, query }) {
// 			const beforeData =
// 				operation === "update"
// 					? await prisma[model as keyof typeof prisma].findUnique({
// 							where: args.where,
// 					  })
// 					: null;

// 			const result = await query(args);

// 			if (["create", "update", "delete"].includes(operation)) {
// 				await prisma.auditLog.create({
// 					data: {
// 						tableName: model!,
// 						recordId: args.where?.id || args.data?.id || null,
// 						action: operation.toUpperCase(),
// 						oldValue: beforeData ? JSON.stringify(beforeData) : null,
// 						newValue: operation !== "delete" ? JSON.stringify(args.data) : null,
// 						changedBy: "system", // Replace with actual user ID
// 					},
// 				});
// 			}

// 			return result;
// 		},
// 	},
// });

export default prisma;
