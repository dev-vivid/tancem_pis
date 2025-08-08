import { Prisma } from "@prisma/client";

export class PrismaErrorHandler {
	static handle(error: any): string {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			switch (error.code) {
				case "P2002":
					return `Unique constraint failed on field(s): ${JSON.stringify(error.meta?.target)}`;

				case "P2025":
					return "Record not found: The requested record does not exist.";

				case "P2003":
					return `Foreign key constraint failed: ${error.meta?.field_name}`;

				case "P2014":
					return "Cascade delete/update failed due to violating foreign key constraints.";

				case "P2001":
					return `The record searched for does not exist: ${error.meta?.model_name}`;

				default:
					return `Prisma error [${error.code}]: ${error.message}`;
			}
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			return `Validation Error: ${error.message}`;
		} else if (error instanceof Prisma.PrismaClientInitializationError) {
			return `Database initialization error: ${error.message}. Check database connection.`;
		} else if (error instanceof Prisma.PrismaClientRustPanicError) {
			return `Prisma has encountered a Rust panic: ${error.message}. Restart the application.`;
		} else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
			return `Unknown database error: ${error.message}`;
		}

		// If it's not a Prisma error, rethrow it as a general error
		return `Unexpected Error: ${error.message}`;
	}
}
