import { userPrimsa } from "@shared/prisma";
import { workflow_process_ID } from "@config/constant";
const PROCESS_ID = "fee31b2d-d40c-4d89-b5f9-52d19a2f61fe";

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
	const [isWorkFlowExist] = await userPrimsa.$queryRawUnsafe<any[]>(
		`
    SELECT * 
    FROM work_flow 
    WHERE role_id = ? 
      AND process_id = ? 
      AND is_active = true 
    LIMIT 1
  `,
		initiatorRoleId,
		workflow_process_ID
	);
	if (!isWorkFlowExist) throw new Error("WorkFlowNotFound");

	// 2. Get initiate state
	const [initiateState] = await userPrimsa.$queryRawUnsafe<any[]>(`
    SELECT * 
    FROM work_flow_state 
    WHERE name = 'initiate' 
      AND is_active = true 
    LIMIT 1
  `);
	if (!initiateState) throw new Error("InitiateStateNotFound");

	// 3. Get process state
	const [processState] = await userPrimsa.$queryRawUnsafe<any[]>(
		`
    SELECT * 
    FROM work_flow_process_state 
    WHERE process_id = ? 
      AND state_id = ? 
      AND is_active = true 
    LIMIT 1
  `,
		PROCESS_ID,
		initiateState.id
	);
	if (!processState) throw new Error("ProcessStateNotFound");

	// 4. Get provided status
	const [providedStatus] = await userPrimsa.$queryRawUnsafe<any[]>(
		`
    SELECT * 
    FROM work_flow_provided_status 
    WHERE initiator = ? 
      AND process_state_id = ? 
      AND is_active = true 
    LIMIT 1
  `,
		initiatorRoleId,
		processState.id
	);
	if (!providedStatus) throw new Error("WorkFlowProvideStatusNotFound");

	// 5. If no status given, fetch from status_master
	let statusText = status;
	if (!statusText || !statusText.trim()) {
		const [statusRecord] = await userPrimsa.$queryRawUnsafe<any[]>(
			`
      SELECT * 
      FROM status_master 
      WHERE id = ? 
        AND is_active = true 
      LIMIT 1
    `,
			providedStatus.status_id
		);
		statusText = statusRecord?.status || "";
	}

	// 6. Insert into work_flow_request (let MySQL generate UUID)
	await userPrimsa.$executeRawUnsafe(
		`
    INSERT INTO work_flow_request 
      (id, process_id, active_provided_status, is_open, initiator, created_by, status) 
    VALUES 
      (UUID(), ?, ?, ?, ?, ?, ?)
  `,
		PROCESS_ID,
		providedStatus.id,
		providedStatus.is_open ?? 1,
		initiatorRoleId,
		userId,
		statusText
	);

	// Fetch back the inserted ID (latest UUID inserted by this user)
	const [wfRequest] = await userPrimsa.$queryRawUnsafe<any[]>(
		`
    SELECT id, active_provided_status 
    FROM work_flow_request 
    WHERE created_by = ? 
    ORDER BY created_at DESC 
    LIMIT 1
  `,
		userId
	);

	// 7. Insert into work_flow_request_list
	await userPrimsa.$executeRawUnsafe(
		`
    INSERT INTO work_flow_request_list 
      (id, wf_request_id, wf_provided_status_id, remarks, created_by) 
    VALUES 
      (UUID(), ?, ?, ?, ?)
  `,
		wfRequest.id,
		wfRequest.active_provided_status,
		remarks ?? null,
		userId
	);

	return wfRequest.id;
}
