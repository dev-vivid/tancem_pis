// import dateUtil from "../date";
// import {audioDownloadPath, downloadPath} from "../../config";
// import responses from "../../responses";
// import {PrismaClient, User} from "@prisma/client";

export const convertToBoolean = (value: string): boolean => {
	if (value === "yes") return true;
	if (value === "true") return true;
	if (value === "no") return false;
	if (value === "false") return false;
	return false;
};

export const uploadFields = () => {
	return [{ name: "files" }, { name: "image" }, { name: "audio" }];
};

export function getFileExtension(inputString: string): string {
	if (inputString) {
		const lastDotIndex = inputString.lastIndexOf(".");
		if (lastDotIndex !== -1) {
			return inputString.substring(lastDotIndex + 1);
		}
		// If there is no dot in the string, return the original string or an empty string.
		return inputString;
	} else {
		return "";
	}
}

export function getFileNameWithoutExt(inputString: string): string {
	if (inputString) {
		const lastDotIndex = inputString.lastIndexOf(".");
		if (lastDotIndex !== -1) {
			return inputString.substring(lastDotIndex + 1);
		}
		// If there is no dot in the string, return the original string or an empty string.
		return inputString;
	} else {
		return "";
	}
}

export function getFileName(inputString: string): string {
	if (inputString) {
		const lastDotIndex = inputString.lastIndexOf(".");
		if (lastDotIndex !== -1) {
			return inputString.substring(lastDotIndex + 1);
		}
		// If there is no dot in the string, return the original string or an empty string.
		return inputString;
	} else {
		return "";
	}
}
//
// export function parseAttachment(task, name) {
//
//   if (task[name] && task[name]['attachment'].length > 0) {
//
//     const files = task[name]['attachment'].filter(item => item.fieldName == 'files');
//     const image = task[name]['attachment'].filter(item => item.fieldName == 'image');
//     const audio = task[name]['attachment'].filter(item => item.fieldName == 'audio');
//
//     const _files = files.map(obj => ({
//         ...obj,
//         downloadPath: `${downloadPath}${obj.id}`
//       })
//     );
//
//     const _image= image.map(obj => ({
//         ...obj,
//         downloadPath: `${downloadPath}${obj.id}`
//       })
//     );
//
//     const _audio = audio.map(obj => ({
//         ...obj,
//         downloadPath: `${audioDownloadPath}${obj.id}`
//       })
//     );
//
//     delete task[name]['attachment'];
//
//     task[name]['attachment'] = {
//       files: _files,
//       image: _image,
//       audio: _audio
//     }
//
//   }
// }
//
// export function parseAttachment2(task, name) {
//
//   if (task[name] && task[name]['attachment'].length > 0) {
//
//     const files = task[name]['attachment'].filter(item => item.fieldName == 'files');
//     const image = task[name]['attachment'].filter(item => item.fieldName == 'image');
//     const audio = task[name]['attachment'].filter(item => item.fieldName == 'audio');
//
//     const _files = files.map(obj => ({
//         ...obj,
//         downloadPath: `${downloadPath}${obj.id}`
//       })
//     );
//
//     const _image= image.map(obj => ({
//         ...obj,
//         downloadPath: `${downloadPath}${obj.id}`
//       })
//     );
//
//     const _audio = audio.map(obj => ({
//         ...obj,
//         downloadPath: `${audioDownloadPath}${obj.id}`
//       })
//     );
//
//     delete task[name]['attachment'];
//
//     task[name]['attachment'] = {
//       files: _files,
//       image: _image,
//       audio: _audio
//     }
//
//     task['attachment'] = {
//       files: _files,
//       image: _image,
//       audio: _audio
//     }
//
//   }
// }
//
//
// export const getDateFromFilter = (value: string): { startDate; endDate } => {
//     let dateVar = dateUtil.getCurrentDate();
//
//     if (value == 'today') {
//         return dateVar = dateUtil.getCurrentDate();
//     } else if (value == 'yesterday') {
//         return dateVar = dateUtil.getYesterdayDate();
//     } else if (value == 'lastWeek') {
//         return dateVar = dateUtil.getLastWeekDateRange();
//     } else if (value == 'thisWeek') {
//         return dateVar = dateUtil.getThisWeekDateRange();
//     } else if (value == 'lastMonth') {
//         return dateVar = dateUtil.getLastMonthDateRange();
//     } else if (value == 'thisMonth') {
//         return dateVar = dateUtil.getThisMonthDateRange();
//     } else if (value == 'lastYear') {
//       return dateVar = dateUtil.getLastYearDateRange();
//     } else if (value == 'thisYear') {
//       return dateVar = dateUtil.getThisYearDateRange();
//     } else if (value == 'tomorrow') {
//       return dateVar = dateUtil.getTomorrowDate();
//     }
//
//     return dateVar;
// }
//
//
//
// export const readAccessUser = async (userId:string) : Promise<any> => {
//
//   const prisma = new PrismaClient();
//
//   try {
//
//     const _user = await prisma.user.findFirst({
//       select: {
//         id: true,
//         fullName: true,
//         stateId:true,
//         adminId:true,
//         zoneId:true,
//         rangeId:true,
//         districtId:true,
//         subDivisionId:true,
//         policeStationId:true,
//         rank: {
//           select: {
//             access: {
//               select: {
//                 id: true,
//                 name: true,
//                 description: true,
//                 isCustom: true,
//                 stateAccess: true,
//                 admAccess: true,
//                 zoneAccess: true,
//                 rangeAccess: true,
//                 districtAccess: true,
//                 subDivAccess: true,
//                 psAccess: true,
//                 customAccess: true,
//               }
//             }
//           }
//         }
//       },
//       where: {
//         id:userId,
//         isDeleted:false,
//       }
//     });
//
//

//     if (_user) {
//       return {
//         adminId: _user.rank.access.admAccess,
//         zoneId: _user.rank.access.zoneAccess,
//         rangeId: _user.rank.access.rangeAccess,
//         districtId: _user.rank.access.districtAccess,
//         subDivisionId: _user.rank.access.subDivAccess,
//         policeStationId: _user.rank.access.psAccess,
//         inputKey: findInputKey(_user.rank.access),
//         inputId: findInputId(_user.rank.access, _user),
//       }
//     } else {
//       return null;
//     }
//
//   } catch (error) {
//     await prisma.$disconnect();
//     return null;
//   }
//
//   function findInputKey(access: any) : string {
//
//     if (access.admAccess){
//       return 'stateId'
//     }
//     if (access.zoneAccess){
//       return 'adminId'
//     }
//     if (access.rangeAccess){
//       return 'zoneId'
//     }
//     if (access.districtAccess){
//       return 'rangeId'
//     }
//     if (access.subDivAccess){
//       return 'districtId'
//     }
//     if (access.psAccess){
//       return 'subDivisionId'
//     }
//
//     return 'policeStationId'
//   }
//
//   function findInputId(access: any,user:any) : string {
//
//
//     if (access.admAccess){
//       return user.stateId
//     }
//     if (access.zoneAccess){
//       return user.adminId
//     }
//     if (access.rangeAccess){
//       return user.zoneId
//     }
//     if (access.districtAccess){
//       return user.rangeId
//     }
//     if (access.subDivAccess){
//       return user.districtId
//     }
//     if (access.psAccess){
//       return user.subDivisionId
//     }
//
//     return user.policeStationId
//
//   }
//
// }
