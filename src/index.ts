import "reflect-metadata";

import {
	BASE_PATH,
	ENV,
	PORT,
	V1_BASE_PATH,
} from "@config/index";
import express, { NextFunction, Request, Response, Router } from "express";

import { ApolloServer } from "@apollo/server";
import { apiV1Routes } from "routes";
import { buildSchema } from "type-graphql";
import { errorHandler } from "@middleware/errorHandler";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import { json } from "body-parser";
import prisma from "@shared/prisma";
import { MasterResolver } from "graphql/masters/MasterResolver";

const cors = require("cors");

const corsOptions = {
	origin: "*", // Reflects the request origin
	credentials: true, // Allow credentials (cookies, authorization headers, etc.)
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Allow these methods
	allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
};

async function main() {
	// ? declaring express apps
	const app = express();
	const server = http.createServer(app);

	// Build the schema
	// const schema = await buildSchema({
	// 	resolvers: [MasterResolver],
	// 	validate: false,
	// });

	// Create Apollo Server
	// const apolloServer = new ApolloServer({ schema });

	// Start the server
	// await apolloServer.start();

	app.use(cors(corsOptions));
	app.use(json());
	// app.use(middleware.logger.apiLoggerMiddleware);
	// app.use(middleware.auditTrail.auditLog);
	// app.use(
	// 	V1_BASE_PATH + "/graphql",
	// 	cors(corsOptions),
	// 	json(),
	// 	expressMiddleware(apolloServer, {
	// 		context: async () => ({ prisma }), // Pass Prisma Client to context
	// 	})
	// );

	// ? API Routes
	app.use(V1_BASE_PATH, apiV1Routes);

	// error middleware
	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		errorHandler(err, req, res, next);
	});

	// ? listening port
	server.listen(PORT, () => {
		console.info("========================================");
		console.info("🚀 Server is up and running!");
		console.info("========================================");
		console.info(`🌍 Environment : ${ENV}`);
		console.info(`🔗 Listening on port : ${PORT}`);
		console.info(`🏠 Host : http://localhost:${PORT}`);
		console.info("========================================");
		console.info("📡 API Endpoints:");
		// console.info(`   - GraphQL Path  : ${V1_BASE_PATH}/graphql`);
		console.info(`   - Version 1 API : ${V1_BASE_PATH}`);
		console.info("========================================");
	});
}

main().catch((err) => console.error(err));
