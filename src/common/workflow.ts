import { userManagementDb } from "@shared/prisma/second_db";
import { constants } from "@config/constant";

interface WorkflowContext {
	userId: string;
	initiatorRoleId: string;
	remarks?: string;
	status?: string;
}

export async function createWorkflowRequest({
	userId,
	initiatorRoleId,
	remarks,
	status,
}: WorkflowContext): Promise<string> {
	// 1. Check workflow exists
	const [workflowRows] = await userManagementDb.execute<any[]>(
		`SELECT * FROM work_flow WHERE role_id = ? AND process_id = ? AND is_active = true LIMIT 1`,
		[initiatorRoleId, constants.workflow_process_ID]
	);
	const isWorkFlowExist = workflowRows[0];
	if (!isWorkFlowExist) throw new Error("WorkFlowNotFound");

	// 2. Get initiate state
	const [stateRows] = await userManagementDb.execute<any[]>(
		`SELECT * FROM work_flow_state WHERE name = 'initiate' AND is_active = true LIMIT 1`
	);
	const initiateState = stateRows[0];
	if (!initiateState) throw new Error("InitiateStateNotFound");

	// 3. Get process state
	const [processRows] = await userManagementDb.execute<any[]>(
		`SELECT * FROM work_flow_process_state WHERE process_id = ? AND state_id = ? AND is_active = true LIMIT 1`,
		[constants.workflow_process_ID, initiateState.id]
	);
	const processState = processRows[0];
	if (!processState) throw new Error("ProcessStateNotFound");

	// 4. Get provided status
	const [statusRows] = await userManagementDb.execute<any[]>(
		`SELECT * FROM work_flow_provided_status WHERE initiator = ? AND process_state_id = ? AND is_active = true LIMIT 1`,
		[initiatorRoleId, processState.id]
	);
	const providedStatus = statusRows[0];
	if (!providedStatus) throw new Error("WorkFlowProvideStatusNotFound");

	// 5. If no status given, fetch from status_master
	let statusText = status?.trim();
	if (!statusText) {
		const [statusMasterRows] = await userManagementDb.execute<any[]>(
			`SELECT * FROM status_master WHERE id = ? AND is_active = true LIMIT 1`,
			[providedStatus.status_id]
		);
		const statusRecord = statusMasterRows[0];
		statusText = statusRecord?.status || "";
	}

	// 6. Insert into work_flow_request
	await userManagementDb.execute(
		`INSERT INTO work_flow_request (id, process_id, active_provided_status, is_open, initiator, created_by, status)
     VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
		[
			constants.workflow_process_ID,
			providedStatus.id,
			providedStatus.is_open ?? 1,
			initiatorRoleId,
			userId,
			statusText,
		]
	);

	// 7. Fetch back the inserted ID (latest by this user)
	const [wfRequestRows] = await userManagementDb.execute<any[]>(
		`SELECT id, active_provided_status FROM work_flow_request WHERE created_by = ? ORDER BY created_at DESC LIMIT 1`,
		[userId]
	);
	const wfRequest = wfRequestRows[0];

	// 8. Insert into work_flow_request_list
	await userManagementDb.execute(
		`INSERT INTO work_flow_request_list (id, wf_request_id, wf_provided_status_id, remarks, created_by)
     VALUES (UUID(), ?, ?, ?, ?)`,
		[wfRequest.id, wfRequest.active_provided_status, remarks ?? null, userId]
	);

	return wfRequest.id;
}
