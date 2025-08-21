import {
	MICROSERVICE_BASE_URL,
	SESSION_VALIDATION_URL,
	INVENTORY_URL,
	ASSET_URL,
} from "@config/index";

export const getMaterialName = async (materialId: string) => {
	try {
		const response = await fetch(
			`${INVENTORY_URL}/RawMaterialItemView?id=${materialId}`
		);
		const data = await response.json();

		if (data && data.length > 0) {
			return data[0].name;
		}

		return null;
	} catch (error) {
		console.error(`Error fetching material name for ID ${materialId}:`, error);
		return null;
	}
};

export const getEquipmentName = async (equipmentId: string) => {
	try {
		const response = await fetch(
			`${INVENTORY_URL}/equipmentgroupView?id=${equipmentId}`
		);
		const data = await response.json();

		if (data && data.length > 0) {
			return data[0].name;
		}

		return null;
	} catch (error) {
		console.error(
			`Error fetching equipmentId name for ID ${equipmentId}:`,
			error
		);
		return null;
	}
};
