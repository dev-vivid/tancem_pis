import { Status } from "@prisma/client";
import prisma, { IPrismaTransactionClient } from "../../../../shared/prisma";
import { pageConfig } from "../../../../shared/prisma/query.helper";
import { extractDateTime } from "@utils/date";
import { getDepartmentName } from "common/api";

export const getAllProblems = async (
	accessToken: string,
	pageNumber?: string,
	pageSize?: string,
	status?: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const { skip, take } = pageConfig({ pageNumber, pageSize });

	const whereClause: any = {
		isActive: true,
		...(status ? { status: status as Status } : {})
	}
	const totalRecords = await tx.problem.count({
		where: whereClause
	});
	
	const problems = await tx.problem.findMany({
		skip,
		take,
		where: whereClause,
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			problemName: true,
			departmentId: true,
			createdAt: true,
			createdById: true,
			updatedById: true,
			updatedAt: true,
			status: true,
			isActive: true
		},
	});

  const data = await Promise.all(
    problems.map(async ({ departmentId, problemName, createdAt, updatedAt, ...rest }) => {
      const departmentName =
        departmentId && accessToken
          ? await getDepartmentName(departmentId, accessToken)
          : null;

      return {
        ...rest,
        id: rest.id,
        problemDescription: problemName,
        plantDepartmentId: departmentId,
        plantDepartmentName: departmentName ? departmentName.name : null,
				// plantDepartmentName: departmentName?.name || null,
        createdAt: extractDateTime(createdAt, "both"),
        updatedAt: extractDateTime(updatedAt, "both"),
      };
    })
  );
	
	return {
		totalRecords,
		data
		}
	};

export const getIdProblem = async (
	id: string,
	accessToken: string,
	tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
	const problem = await tx.problem.findUnique({
		where: {
			id
		},
		select: {
			id: true,
			name: true,
			problemName: true,
			departmentId: true,
			createdAt: true,
			createdById: true,
			updatedById: true,
			updatedAt: true,
			status: true,
			isActive: true
		},
	});

	if(!problem) throw new Error("Problem not found");

	const departmentName = problem.departmentId && accessToken ? await getDepartmentName(problem.departmentId, accessToken) : null;
	
	
	const data = { 
        id: problem.id,
				plantDepartmentId: problem.departmentId,
				plantDepartmentName: departmentName.name,
				problemDescription: problem.problemName,
        createdAt: extractDateTime(problem.createdAt, "both"),
        updatedAt: extractDateTime(problem.updatedAt, "both"),
				createdBy: problem.createdById,
				updatedBy: problem.updatedById,
				isActive: problem.isActive,
				status: problem.status
	};
	return {
		data
	}
};

// export const getAllProblems = async (
//     pageNumber?: number,
//     pageSize?: number,
//     tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
//     const { skip, take } = pageConfig({
//         pageNumber: pageNumber?.toString(),
//         pageSize: pageSize?.toString(),
//     });

//     // Count total active problems
//     const totalRecords = await tx.problem.count({
//         where: { isActive: true }
//     });

//     // Get problems with department names using raw SQL for cross-schema join
// 		const problems: any[] = await tx.$queryRaw`
// 				SELECT 
// 						p.id AS uuid,
// 						p.code,
// 						p.name,
// 						p.description,
// 						p.department_id AS departmentId,
// 						s.name AS departmentName,
// 						p.problem AS problem,
// 						p.sort_order AS sortOrder,
// 						p.created_at AS createdAt,
// 						p.created_by_id AS createdById,
// 						p.updated_at AS updatedAt,
// 						p.updated_by_id AS updatedById,
// 						p.is_active AS isActive
// 				FROM 
// 						tancem_pis_staging_v2.problem p
// 				LEFT JOIN 
// 						tancem_user_management.section s 
// 						ON p.department_id = s.id
// 				WHERE 
// 						p.is_active = 1
// 				ORDER BY 
// 						p.created_at ASC
// 				LIMIT ${take}
// 				OFFSET ${skip}
// 		`;

//     // Format dates
//     const data = problems.map(item => ({
//         ...item,
//         createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
//         updatedAt: item.updatedAt.toISOString().replace("T", " ").substring(0, 19)
//     }));

//     return {
//         totalRecords,
//         data,
//     };
// };

// Get problem by ID with department name
// export const getIdProblem = async (
//     id: string,
//     tx: IPrismaTransactionClient | typeof prisma = prisma
// ) => {
// 		const problems: any[] = await tx.$queryRaw`
// 			SELECT 
// 					p.id AS uuid,
// 					p.code,
// 					p.name,
// 					p.description,
// 					p.department_id AS departmentId,
// 					s.name AS departmentName,
// 					p.problem AS problem,
// 					p.sort_order AS sortOrder,
// 					p.created_at AS createdAt,
// 					p.created_by_id AS createdById,
// 					p.updated_at AS updatedAt,
// 					p.updated_by_id AS updatedById,
// 					p.is_active AS isActive
// 			FROM 
// 					tancem_pis_staging_v2.problem p
// 			LEFT JOIN 
// 					tancem_user_management.section s 
// 					ON p.department_id = s.id
// 			WHERE 
// 					p.id = ${id}
// 					AND p.is_active = 1
// 		`;

//     if (!problems || problems.length === 0) {
//         throw new Error("Problem not found.");
//     }

//     const item = problems[0];
    
//     // Format dates
//     const data = {
//         ...item,
//         createdAt: item.createdAt.toISOString().replace("T", " ").substring(0, 19),
//         updatedAt: item.updatedAt.toISOString().replace("T", " ").substring(0, 19)
//     };

//     return {
//         data,
//     };
// };

// Create problem
export const createProblem = async (
    problemData: { 
        name: string; 
        description?: string; 
        plantDepartmentId: string; 
        problemDescription: string;
        sortOrder?: number;
    },
    user: string,
    tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
    const { name, description, plantDepartmentId, problemDescription, sortOrder } = problemData;

    // Create using Prisma's ORM
   const create =  await tx.problem.create({
        data: {
            name,
						description,
            departmentId: plantDepartmentId,
            problemName: problemDescription,
            sortOrder: sortOrder || 0,
            createdById: user
        },
   });
};

// Update problem
export const updateProblem = async (
    id: string,
    problemData: { 
        name?: string; 
        description?: string; 
        plantDepartmentId: string; 
        problemDescription: string;
        sortOrder?: number;
				status: Status;
    },
    user: string,
    tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
    const { name, description, plantDepartmentId, problemDescription, sortOrder, status } = problemData;

    if (!id) throw new Error("ID is required for updating problem.");

    // Update using Prisma's ORM
    await tx.problem.update({
        where: { id },
        data: {
            name,
            description,
            departmentId: plantDepartmentId,
            problemName: problemDescription,
            sortOrder,
						status,
            updatedById: user,
        },
    });
};

// Soft delete problem
export const deleteProblem = async (
    id: string,
    user: string,
    tx: IPrismaTransactionClient | typeof prisma = prisma
) => {
    // Validation
    if (!id) throw new Error("ID is required for deleting problem.");
    
    // Soft delete using isActive flag
    await tx.problem.update({
        where: { id },
        data: {
            isActive: false,
            updatedById: user,
        },
    });
};
