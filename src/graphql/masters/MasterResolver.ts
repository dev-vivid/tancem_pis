import { Resolver, Query, Arg, Int } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Resolver()
export class MasterResolver {
	private whitelist: string[] = [
		"employeeSectionDesignationMaster",
		"departmentMaster",
		"employeeDesignationMaster",
	];

	@Query(() => [GraphQLJSONObject])
	async getMaster(
		@Arg("schema", () => String) schema: string,

		@Arg("entity", () => String) entity: "d",
		@Arg("filters", () => String, { nullable: true }) filters?: string,
		@Arg("search", () => String, { nullable: true }) search?: string,
		@Arg("searchField", () => String, { nullable: true }) searchField?: string,
		@Arg("orderBy", () => String, { nullable: true }) orderBy?: string,
		@Arg("include", () => String, { nullable: true }) include?: string,
		@Arg("take", () => Int, { nullable: true }) take?: number,
		@Arg("skip", () => Int, { nullable: true }) skip?: number
	): Promise<any[]> {
		const allowedEntities = this.whitelist || [];
		if (!allowedEntities.includes(entity)) {
			throw new Error(
				`Access to entity '${entity}' is not allowed in schema '${schema}'`
			);
		}

		const model = (prisma as any)[entity];
		if (!model) {
			throw new Error(`Model '${entity}' does not exist in Prisma Client`);
		}

		let where: any = {};
		if (filters) {
			try {
				where = JSON.parse(filters);
			} catch {
				throw new Error("Invalid filters format. Must be valid JSON.");
			}
		}

		if (search && searchField) {
			where[searchField] = {
				contains: search,
				// mode: "insensitive",
			};
		}

		let parsedOrderBy: any = undefined;
		if (orderBy) {
			try {
				parsedOrderBy = JSON.parse(orderBy); // example: { "name": "asc" }
			} catch {
				throw new Error("Invalid orderBy format. Must be valid JSON.");
			}
		}

		let parsedInclude: any = undefined;
		if (include) {
			try {
				parsedInclude = JSON.parse(include); // example: { "department": true }
			} catch {
				throw new Error("Invalid include format. Must be valid JSON.");
			}
		}

		return model.findMany({
			where: {
				isActive: true,
				...where,
			},
			orderBy: parsedOrderBy,
			include: parsedInclude,
			take: take ?? 50,
			skip: skip ?? 0,
		});
	}
}
