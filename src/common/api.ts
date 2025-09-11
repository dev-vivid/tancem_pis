import {
	MICROSERVICE_BASE_URL,
	SESSION_VALIDATION_URL,
	INVENTORY_URL,
	ASSET_URL,
	USER_MANAGEMENT_URL,
	SALES_URL,
} from "@config/index";

// export const getMaterialNameFromInventory = async (
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
// export const getMaterialName = async (
// 	materialId: string,
// 	accessToken: string
// ) => {
// 	const token = `Bearer ${accessToken}`;
// 	const apiUrl = `${SALES_URL}/productView/${materialId}`;
// 	try {
// 		// console.log("API URL being called:", apiUrl);

// 		const response = await fetch(apiUrl, {
// 			headers: new Headers({
// 				"content-type": "application/json",
// 				authorization: token,
// 			}),
// 			method: "GET",
// 		});

// 		const data = await response.json();
// 		// console.log("API data:", data);
// 		if (data?.data?.list) {
// 			return data.data.list;
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
): Promise<{ id: string; name: string } | null> => {
	const token = `Bearer ${accessToken}`;

	// ---- 1. Try Sales API ----
	try {
		const salesUrl = `${SALES_URL}/productView/${materialId}`;
		const salesResponse = await fetch(salesUrl, {
			headers: {
				"content-type": "application/json",
				authorization: token,
			},
			method: "GET",
		});

		if (salesResponse.ok) {
			const salesData = await salesResponse.json();
			if (salesData?.data?.list) {
				return salesData.data.list;
			}
		}
	} catch (error) {
		console.warn(`Sales API failed for material ${materialId}:`, error);
	}

	// ---- 2. Fallback: Try Inventory API ----
	try {
		const inventoryUrl = `${INVENTORY_URL}/RawMaterialItemView/${materialId}`;
		const invResponse = await fetch(inventoryUrl, {
			headers: {
				"content-type": "application/json",
				authorization: token,
			},
			method: "GET",
		});

		if (invResponse.ok) {
			const invData = await invResponse.json();

			// ✅ Case: list is a single object (your API case)
			if (invData?.data?.list && typeof invData.data.list === "object") {
				return {
					id: invData.data.list.id,
					name: invData.data.list.productDescription,
				};
			}

			// ✅ Case: list is an array (future-proof)
			if (Array.isArray(invData?.data?.list)) {
				const item = invData.data.list.find((x: any) => x.id === materialId);
				if (item) {
					return { id: item.id, name: item.productDescription };
				}
			}
		}
	} catch (error) {
		console.error(
			`Inventory API also failed for material ${materialId}:`,
			error
		);
	}
	// ---- 3. Nothing found ----
	return null;
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
		if (data?.data?.list) {
			return data.data.list;
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

export const getDepartmentName = async (
	departmentId: string,
	accessToken: string
) => {
	const token = `Bearer ${accessToken}`;
	try {
		const response = await fetch(
			`${USER_MANAGEMENT_URL}/section/${departmentId}`,
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
		if (data?.success && data?.data) {
			return data.data;
		}

		return null;
	} catch (error) {
		console.error(
			`Error fetching equipment name for ID ${departmentId}:`,
			error
		);
		return null;
	}
};

export const getOfficeName = async (officeId: string, accessToken: string) => {
	const token = `Bearer ${accessToken}`;
	try {
		const response = await fetch(
			`${USER_MANAGEMENT_URL}/office?table=office`,

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
		if (data?.success && data?.data?.data) {
			return data.data.data;
		}

		return null;
	} catch (error) {
		console.error(`Error fetching equipment name for ID ${officeId}:`, error);
		return null;
	}
};

export const getEquipmentSubGroupName = async (
	equipmentSubGroupId: string,
	accessToken: string
) => {
	const token = `Bearer ${accessToken}`;
	try {
		const response = await fetch(
			`${ASSET_URL}/equipmentSubGroupView/${equipmentSubGroupId}`,
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
		if (data?.success && data?.data?.list) {
			return data.data.list;
		}

		return null;
	} catch (error) {
		console.error(
			`Error fetching equipment name for ID ${equipmentSubGroupId}:`,
			error
		);
		return null;
	}
};
