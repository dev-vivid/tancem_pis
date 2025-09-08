import { PrismaClient } from "@prisma/client";
import { USER_DATABASE_URL } from "../../config/index";
import { parseMySQLConnectionString } from "./parser";
import * as mysql from "mysql2/promise";

export const prisma = new PrismaClient();

const secondDbConfigFromUri = parseMySQLConnectionString(USER_DATABASE_URL);

export const userManagementDb = mysql.createPool({
	host: secondDbConfigFromUri.host,
	user: secondDbConfigFromUri.user,
	password: secondDbConfigFromUri.password,
	database: secondDbConfigFromUri.database,
	port: secondDbConfigFromUri.port,
	waitForConnections: true,
	connectionLimit: 20, // 20 per app instance (adjust by #instances)
	queueLimit: 1000, // Avoid huge queues (fail fast >1000 waiting requests)
	idleTimeout: 15000, // 15s idle timeout
	connectTimeout: 15000, // fail faster on DB issues
	compress: true,
});
