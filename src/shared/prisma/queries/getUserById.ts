import { USER_DATABASE_NAME } from "@config/index";
import { userManagementDb } from "../second_db";

const getUserData = async (userId: string) => {
	const query = `
	SELECT u.id,u.first_name,u.last_name , r.name , r.id as role_id FROM ${USER_DATABASE_NAME}.user u join ${USER_DATABASE_NAME}.user_role ur on ur.user_id = u.id join ${USER_DATABASE_NAME}.roles r on r.id = ur.role_id  where u.id=? and u.is_active = 1 and ur.is_active = 1 and r.is_active = 1
	`;

	const [result]: any[] = await userManagementDb.execute(query, [userId]);

	const userData = {
		userName: `${result[0].first_name} ${result[0].last_name}`,
		roleName: `${result[0].name}`,
		id: result[0].id,
		roleId: result[0].role_id,
	};

	return userData;
};

export default getUserData;
