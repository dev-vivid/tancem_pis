const fs = require("fs");
const path = require("path");

// Utility to convert "test" -> "Test" (PascalCase for class names)
const toPascalCase = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Get module name and version from CLI arguments
const moduleName = process.argv[2];
const version = process.argv[3] || "v1"; // Default to v1 if no version provided

if (!moduleName) {
	console.error("❌ Error: Please provide a module name.");
	console.log("Usage: node generateModule.js <moduleName> [version]");
	process.exit(1);
}

const PascalModuleName = toPascalCase(moduleName);
const modulePath = path.join(__dirname, `src/modules/${version}/${moduleName}`);

const structure = {
	controllers: [
		{
			name: `${moduleName}.controller.ts`,
			content: `import { Request, Response } from 'express';
import { create${PascalModuleName}Usecase } from '../usecases/create${PascalModuleName}WithRelatedData.usecase';

export const handleCreate${PascalModuleName} = async (req: Request, res: Response) => {
  try {
    const result = await create${PascalModuleName}Usecase(req.body);
    res.json(result);
  } catch (error:any) {
    res.status(500).json({ error: error?.message });
  }
};`,
		},
	],
	services: [
		{
			name: `create${PascalModuleName}.service.ts`,
			content: `import prisma, { IPrismaTransactionClient } from '@shared/prisma';

export interface ICreate${PascalModuleName}ServiceProps { 
	name: string 
}

export const create${PascalModuleName}Service = async (data: ICreate${PascalModuleName}ServiceProps, tx:IPrismaTransactionClient| typeof prisma = prisma ) => {
  return tx.${moduleName}.create({ data });
};`,
		},
		{
			name: `get${PascalModuleName}ById.service.ts`,
			content: `import prisma, { IPrismaTransactionClient } from '@shared/prisma';

export interface IGet${PascalModuleName}ServiceProps { 
	id: string 
}


export const get${PascalModuleName}ServiceById = async ({id}:IGet${PascalModuleName}Props, tx:IPrismaTransactionClient| typeof prisma = prisma) => {
  return tx.${moduleName}.findUnique({ where: { id } });
};`,
		},
	],
	usecases: [
		{
			name: `create${PascalModuleName}WithRelatedData.usecase.ts`,
			content: `import prisma from '@shared/prisma';
import { create${PascalModuleName}Service } from '../services/create${PascalModuleName}.service';

export const create${PascalModuleName}Usecase = async (data: { name: string }) => {
  return prisma.$transaction(async (tx) => {
    return create${PascalModuleName}Service(data, tx);
  });
};`,
		},
	],
	routes: [
		{
			name: `${moduleName}.routes.ts`,
			content: `import express from 'express';
import { handleCreate${PascalModuleName} } from '../controllers/${moduleName}.controller';
import { validateRequest } from '@middleware/validateRequest';
import { ${moduleName}Schema } from '../validations/${moduleName}.schema';

const ${moduleName}Router = express.Router();

${moduleName}Router.post('/create', validateRequest(${moduleName}Schema), handleCreate${PascalModuleName});

export default ${moduleName}Router;`,
		},
	],
	validations: [
		{
			name: `${moduleName}.schema.ts`,
			content: `import Joi from 'joi';

export const ${moduleName}Schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
});`,
		},
	],
};

// Function to create files recursively
const createModule = () => {
	Object.entries(structure).forEach(([folder, files]) => {
		const folderPath = path.join(modulePath, folder);
		if (!fs.existsSync(folderPath)) {
			fs.mkdirSync(folderPath, { recursive: true });
		}
		files.forEach(({ name, content }) => {
			const filePath = path.join(folderPath, name);
			if (!fs.existsSync(filePath)) {
				fs.writeFileSync(filePath, content);
				console.log(`✅ Created: ${filePath}`);
			} else {
				console.log(`⚠️ Skipped (already exists): ${filePath}`);
			}
		});
	});
};

createModule();
console.log(`🚀 Module '${moduleName}' created successfully in '${version}'!`);
