import { PrismaClient } from "@prisma/client";
import { getDMMF } from "@prisma/internals";
import { readFileSync } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

export class MasterService {
	private dmmf: any;

	constructor() {
		this.initDMMF();
	}
	async initDMMF() {
		const schemaPath = join(process.cwd(), "prisma", "schema", "schema.prisma");
		const datamodel = readFileSync(schemaPath, "utf-8");
		this.dmmf = await getDMMF({ datamodel });

		// this.dmmf = await getDMMF({ datamodel: Prisma.dmmf.datamodel });
	}

	private validateFilters(modelName: string, filters: Record<string, any>) {
		const model = this.dmmf.models.find(
			(m: any) => m.name.toLowerCase() === modelName.toLowerCase()
		);
		if (!model) throw new Error(`Unknown model: ${modelName}`);

		const validFields = new Set(model.fields.map((f: any) => f.name));
		const invalidKeys = Object.keys(filters).filter(
			(key) => !validFields.has(key)
		);
		if (invalidKeys.length) {
			throw new Error(
				`Invalid filter fields for ${modelName}: ${invalidKeys.join(", ")}`
			);
		}
	}

	async getMasterData(entity: string, filters: any = {}) {
		const model = (prisma as any)[entity];
		if (!model) throw new Error(`Unknown entity: ${entity}`);

		this.validateFilters(entity, filters);
		return model.findMany({ where: filters });
	}
}
