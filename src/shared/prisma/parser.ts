export function parseMySQLConnectionString(connectionString?: string) {
	if (!connectionString)
		throw {
			code: "dbUrlNotFound",
			statusCode: 500,
			message: "DB url not found",
		};
	const url = new URL(connectionString.replace("mysql://", "http://")); // Replace scheme to parse

	return {
		host: url.hostname,
		user: url.username,
		password: url.password,
		database: url.pathname.substring(1), // Remove leading '/'
		port: url.port ? parseInt(url.port, 10) : 3306, // Default MySQL port
	};
}
