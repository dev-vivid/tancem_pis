import { USER_DATABASE_NAME } from "@config/index";
import { userManagementDb } from "../second_db";

const getUserData = async (userId: string) => {
	const query = `
	SELECT id,first_name,last_name FROM ${USER_DATABASE_NAME}.user where id=? and is_active = 1
	`;
	const [result]: any[] = await userManagementDb.execute(query, [userId]);

	const userData = `${result[0].first_name} ${result[0].last_name}`;

	return userData;
};

export default getUserData;
