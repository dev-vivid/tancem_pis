import { Prisma, PrismaClient } from "@prisma/client";
import { IPrismaTransactionClient } from ".";

export async function getRecords<T>(
	tx: IPrismaTransactionClient,
	model: keyof IPrismaTransactionClient, // The model name (e.g., 'employee', 'department')
	filter: Prisma.Args<T, "findMany">["where"], // Filter criteria
	options: {
		skip?: number;
		take?: number;
		orderBy?: Prisma.Args<T, "findMany">["orderBy"];
		select?: Prisma.Args<T, "findMany">["select"];
	} = {}
) {
	const { skip, take, orderBy, select } = options;

	// Dynamically access the model from Prisma Client
	const result = await (tx[model] as any).findMany({
		where: filter,
		// skip,
		// take,
		// orderBy,
		select,
		// omit,
	});

	return result;
}
