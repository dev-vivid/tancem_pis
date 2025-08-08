// import jwt from "jsonwebtoken";
// import createError from "http-errors";
// // import {
// //   ACCESS_TOKEN_EXPIRY,
// //   ACCESS_TOKEN_SECRET,
// //   ID_TOKEN_EXPIRY,
// //   ID_TOKEN_SECRET,
// //   REFRESH_TOKEN_EXPIRY,
// //   REFRESH_TOKEN_SECRET,
// // } from "../../config";

// import { v4 as uuid } from "uuid";

// function signIdToken(payload: any) {
//   return new Promise((resolve, reject) => {
//     const data = { ...payload, tid: uuid(), tokenUse:'id' };
//     jwt.sign(
//       data,
//       ID_TOKEN_SECRET as string,
//       { expiresIn: ID_TOKEN_EXPIRY },
//       (err:any, token:string) => {
//         if (err) {
//           reject(createError.InternalServerError());
//         }
//         resolve(token);
//       }
//     );
//   });
// }
// function signAccessToken(payload:{username:string|null, id:string, idp:string, sid:string }) {
//   return new Promise((resolve, reject) => {
//     const data = {
//       tid: uuid(),
//       sid: payload.sid,
//       sub: payload.id,
//       uid: payload.id,
//       username: payload.username,
//       tokenUse:'access',
// 			idp: payload.idp
//     };
//     jwt.sign(
//       data,
//       ACCESS_TOKEN_SECRET as string,
//       { expiresIn: ACCESS_TOKEN_EXPIRY },
//       (err:any, token:string) => {
//         if (err) {
//           reject(createError.InternalServerError());
//         }
//         resolve(token);
//       }
//     );
//   });
// }

// function verifyAccessToken(token:string) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, ACCESS_TOKEN_SECRET as string, (err:any, payload:string) => {
//       if (err) {
//         const message =
//           err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
//         return reject(createError.Unauthorized(message));
//       }
//       resolve(payload);
//     });
//   });
// }
// function verifyRefreshToken(token:string) {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, REFRESH_TOKEN_SECRET as string, (err:any, payload:string) => {
//       if (err) {
//         const message =
//           err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
//         return reject(createError.Unauthorized(message));
//       }
//       resolve(payload);
//     });
//   });
// }
// // dd

// function signRefreshToken(payload:any) {
//   return new Promise((resolve, reject) => {
//     const data = {
//       username: payload.email,
//       sub: payload.id,
//       id: payload.id,
//       tid: uuid(),
//       tokenUse:'refresh'
//     };
//     jwt.sign(
//       data,
//       REFRESH_TOKEN_SECRET as string,
//       { expiresIn: REFRESH_TOKEN_EXPIRY },
//       (err:any, token:string) => {
//         if (err) {
//           reject(createError.InternalServerError());
//         }
//         resolve(token);
//       }
//     );
//   });
// }

// function signAccessTokenUsingRefreshToken(data:any) {
// 	return new Promise((resolve, reject) => {
// 		jwt.sign(
// 			data,
// 			ACCESS_TOKEN_SECRET as string,
// 			{ expiresIn: ACCESS_TOKEN_EXPIRY },
// 			(err: any, token:string) => {
// 				if (err) {
// 					reject(createError.InternalServerError());
// 				}
// 				resolve(token);
// 			}
// 		);
// 	});
// }

// // function verifyRefreshToken(refreshToken) {}

// export default {
//   signAccessToken,
//   verifyAccessToken,
//   signIdToken,
//   signRefreshToken,
//   verifyRefreshToken,
// 	signAccessTokenUsingRefreshToken
// };
