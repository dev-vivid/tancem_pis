export interface IAuthUser {
	id: string;
	firstName: string;
	lastName: string | null;
	email: string | null;
	UserRole: string | null;
	phoneNumber: string | null;
}

declare global {
	namespace Express {
		interface Request {
			user: IAuthUser;
		}
	}
}
