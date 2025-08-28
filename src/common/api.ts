import {
	MICROSERVICE_BASE_URL,
	SESSION_VALIDATION_URL,
	INVENTORY_URL,
	ASSET_URL,
} from "@config/index";

// export const getMaterialName = async (
// 	materialId: string,
// 	accessToken: string
// ) => {
// 	const token = `Bearer ${accessToken}`;
// 	try {
// 		const response = await fetch(
// 			`${INVENTORY_URL}/RawMaterialItemView?id=${materialId}`,
// 			{
// 				headers: new Headers({
// 					"content-type": "application/json",
// 					// authorization: `${accessToken}`,
// 					authorization: token,
// 				}),
// 				method: `GET`,
// 			}
// 		);
// 		const data = await response.json();
// 		console.log(
// 			"---------------*******************----------------------------"
// 		);
// 		console.log(data);
// 		console.log(
// 			"-------------------%%%%%%%%%%%%%%%%%%%%%%%------------------------"
// 		);

// 		if (data && data.length > 0) {
// 			return data[0].name;
// 		}
// 		return null;
// 	} catch (error) {
// 		console.error(`Error fetching material name for ID ${materialId}:`, error);
// 		return null;
// 	}
// };
export const getMaterialName = async (
	materialId: string,
	accessToken: string
) => {
	const token = `Bearer ${accessToken}`;
	const apiUrl = `${INVENTORY_URL}/RawMaterialItemView/${materialId}`;

	try {
		// ✅ Print the API URL
		// console.log("API URL being called:", apiUrl);

		const response = await fetch(apiUrl, {
			headers: new Headers({
				"content-type": "application/json",
				authorization: token,
			}),
			method: "GET",
		});

		const data = await response.json();

		// console.log("---------------*******************----------------------------");
		// console.log("API Response:", data);
		// console.log("-------------------%%%%%%%%%%%%%%%%%%%%%%%------------------------");

		// ✅ Correct way to extract productDescription
		if (data && data.success && data.data && data.data.list) {
			return data.data.list.productDescription; // Or productCode, or createdBy, etc.
		}

		return null;
	} catch (error) {
		console.error(`Error fetching material name for ID ${materialId}:`, error);
		return null;
	}
};

export const getEquipmentName = async (
	equipmentId: string,
	accessToken: string
) => {
	const token = `Bearer ${accessToken}`;
	try {
		const response = await fetch(
			`${ASSET_URL}/equipmentMainGroupView/${equipmentId}`,
			{
				headers: new Headers({
					"content-type": "application/json",
					authorization: token,
				}),
				method: "GET",
			}
		);

		const data = await response.json();
		// console.log("API Raw Response:", data);

		// ✅ Check response structure
		if (data?.data?.list?.name) {
			return data.data.list.name;
		}

		return null;
	} catch (error) {
		console.error(
			`Error fetching equipment name for ID ${equipmentId}:`,
			error
		);
		return null;
	}
};
