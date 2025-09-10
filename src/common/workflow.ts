import { userManagementDb } from "@shared/prisma/second_db";

interface WorkflowContext {
	userId: string;
	initiatorRoleId: string;
	processId: string;
	remarks?: string;
	status?: string;
}

interface CurrentStateResult {
	wfRequest: {
		id: string;
		isActive: boolean;
		createdAt: Date;
		updatedAt: Date;
		processId: string;
		isOpen: number;
		initiator: string;
		status: string;
	};
	currentStatus: {
		initiator: string;
		status: string;
		initiatorRoleId: string | null;
		initiatorName: string | null;
		canEdit: boolean;
		canDelete: boolean;
	};
	workFlowProcessState: {
		name: string;
		label: string;
		bgColor: string;
		fgColor: string;
		postLabel: string;
	} | null;
}

interface NextActionResult {
	id: string;
	initiator: string;
	workFlowId: string;
	processStateId: string;
	nextActioner: string | null;
	initiatorRoleName: string | null;
	nextActionerRoleName: string | null;
	processState: {
		name: string;
		isRemarkRequired: boolean;
		state: {
			name: string;
			label: string;
			bgColor: string;
			fgColor: string;
			postLabel: string;
		};
	} | null;
}

interface RemarkResult {
	actionTakenAt: Date;
	actioner: string;
	state: string;
	remarks: string | null;
	createdBy: string;
}

export async function createWorkflowRequest({
	userId,
	initiatorRoleId,
	processId,
	remarks,
	status,
}: WorkflowContext): Promise<string> {
	// 1. Check workflow exists
	const [workflowRows] = await userManagementDb.execute<any[]>(
		`SELECT * FROM work_flow WHERE role_id = ? AND process_id = ? AND is_active = true LIMIT 1`,
		[initiatorRoleId, processId]
	);
	const isWorkFlowExist = workflowRows[0];
	console.log("Debug workflow check", {
		initiatorRoleId,
		processId,
		workflowRows,
	});

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
		[processId, initiateState.id]
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
			processId,
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

export async function fetchClosedWorkflowIdsWithoutRole(
	processId: string,
	isOpen: string,
	status: string
): Promise<string[]> {
	// 1. Check workflow process exists
	const [processRows] = await userManagementDb.execute<any[]>(
		`SELECT * FROM work_flow_process WHERE id = ? AND is_active = true LIMIT 1`,
		[processId]
	);
	const process = processRows[0];
	if (!process) throw new Error("WorkFlowProcessNotFound");

	// 2. Convert isOpen to boolean (db usually stores tinyint/bool)
	const isOpenValue = isOpen === "true" ? 1 : 0;

	// 3. Query workflow requests for given process, closed/open, active and matching status
	const [wfRequestRows] = await userManagementDb.execute<any[]>(
		`SELECT id FROM work_flow_request 
         WHERE process_id = ? 
         AND is_open = ? 
         AND is_active = true 
         AND status = ?`,
		[processId, isOpenValue, status]
	);

	// 4. Return only IDs
	return wfRequestRows.map((row) => row.id);
}

export async function getCurrentState(
	wfRequestId: string
): Promise<CurrentStateResult> {
	if (!wfRequestId) throw new Error("WorkFlowRequestIdMissing");

	const [wfRequestRows] = await userManagementDb.execute<any[]>(
		`SELECT id, is_active AS isActive, created_at AS createdAt, updated_at AS updatedAt,
            process_id AS processId, active_provided_status AS activeProvidedStatusId,
            is_open AS isOpen, initiator, status
       FROM work_flow_request
      WHERE id = ? AND is_active = true
      LIMIT 1`,
		[wfRequestId]
	);
	const wfRequest = wfRequestRows[0];
	if (!wfRequest) throw new Error("WorkFlowRequestNotFound");

	const [statusRows] = await userManagementDb.execute<any[]>(
		`SELECT wps.id,
            wps.initiator,
            wps.status_id AS statusId,
            wps.can_edit AS canEdit,
            wps.can_delete AS canDelete,
            r.id AS initiatorRoleId,
            r.name AS initiatorName,
            s.name, s.label, s.bg_color AS bgColor, s.fg_color AS fgColor, s.post_label AS postLabel
       FROM work_flow_provided_status wps
  LEFT JOIN roles r ON r.id = wps.initiator
  LEFT JOIN work_flow_process_state ps ON wps.process_state_id = ps.id
  LEFT JOIN work_flow_state s ON ps.state_id = s.id
      WHERE wps.id = ?`,
		[wfRequest.activeProvidedStatusId]
	);
	const current = statusRows[0];
	if (!current) throw new Error("WorkFlowProvideStatusNotFound");

	return {
		wfRequest,
		currentStatus: {
			initiator: current.initiator,
			status: current.statusId,
			initiatorRoleId: current.initiatorRoleId ?? null,
			initiatorName: current.initiatorName ?? null,
			canEdit: !!current.canEdit,
			canDelete: !!current.canDelete,
		},
		workFlowProcessState: current.name
			? {
					name: current.name,
					label: current.label,
					bgColor: current.bgColor,
					fgColor: current.fgColor,
					postLabel: current.postLabel,
			  }
			: null,
	};
}

export async function getNextAction(
	wfRequestId: string
): Promise<NextActionResult[]> {
	if (!wfRequestId) return [];

	// 1. Check if request exists and is open
	const [reqRows] = await userManagementDb.execute<any[]>(
		`SELECT id, active_provided_status AS activeProvidedStatusId
       FROM work_flow_request
      WHERE id = ? AND is_active = 1 AND is_open = 1
      LIMIT 1`,
		[wfRequestId]
	);
	const request = reqRows[0];
	if (!request) return [];

	// 2. Get current provided status
	const [currentStatusRows] = await userManagementDb.execute<any[]>(
		`SELECT id, work_flow_id AS workFlowId, next_actioner AS nextActioner
       FROM work_flow_provided_status
      WHERE id = ? AND is_active = 1
      LIMIT 1`,
		[request.activeProvidedStatusId]
	);
	const current = currentStatusRows[0];
	if (!current || !current.nextActioner) return [];

	// 3. Fetch next actions
	const [nextActionRows] = await userManagementDb.execute<any[]>(
		`SELECT wps.id,
            wps.initiator,
            wps.work_flow_id AS workFlowId,
            wps.process_state_id AS processStateId,
            wps.next_actioner AS nextActioner,
            ir.name AS initiatorRoleName,
            nar.name AS nextActionerRoleName,
            ps.name AS processStateName,
            ps.is_remark_required AS isRemarkRequired,
            s.name AS stateName, s.label, s.bg_color AS bgColor,
            s.fg_color AS fgColor, s.post_label AS postLabel
       FROM work_flow_provided_status wps
  LEFT JOIN roles ir ON ir.id = wps.initiator 
  LEFT JOIN roles nar ON nar.id = wps.next_actioner
  LEFT JOIN work_flow_process_state ps ON wps.process_state_id = ps.id
  LEFT JOIN work_flow_state s ON ps.state_id = s.id
      WHERE wps.work_flow_id = ? AND wps.initiator = ? AND wps.is_active = 1`,
		[current.workFlowId, current.nextActioner]
	);

	return nextActionRows.map((row) => ({
		id: row.id,
		initiator: row.initiator,
		workFlowId: row.workFlowId,
		processStateId: row.processStateId,
		nextActioner: row.nextActioner,
		initiatorRoleName: row.initiatorRoleName ?? null,
		nextActionerRoleName: row.nextActionerRoleName ?? null,
		processState: row.processStateName
			? {
					name: row.processStateName,
					isRemarkRequired: !!row.isRemarkRequired,
					state: {
						name: row.stateName,
						label: row.label,
						bgColor: row.bgColor,
						fgColor: row.fgColor,
						postLabel: row.postLabel,
					},
			  }
			: null,
	}));
}

export async function getRemarks(wfRequestId: string): Promise<RemarkResult[]> {
	// 1. Get all remarks list items
	const [listRows] = await userManagementDb.execute<any[]>(
		`SELECT wfrl.id, wfrl.wf_provided_status_id AS wfProvidedStatusId,
            wfrl.remarks, wfrl.created_at AS createdAt,
            wfrl.isAdmin AS isAdmin,
            u.id AS userId, u.first_name AS firstName, u.last_name AS lastName, u.email
       FROM work_flow_request_list wfrl
  LEFT JOIN user u ON wfrl.created_by = u.id
      WHERE wfrl.wf_request_id = ? AND wfrl.is_active = 1
      ORDER BY wfrl.created_at DESC`,
		[wfRequestId]
	);

	if (!listRows.length) return [];

	const statusIds = listRows.map((row) => row.wfProvidedStatusId);

	// 2. Fetch all provided statuses with roles + states
	const [statusRows] = await userManagementDb.execute<any[]>(
		`SELECT wps.id,
            ir.name AS initiatorRoleName,
            s.post_label AS postLabel
       FROM work_flow_provided_status wps
  LEFT JOIN roles ir ON ir.id = wps.initiator
  LEFT JOIN work_flow_process_state ps ON wps.process_state_id = ps.id
  LEFT JOIN work_flow_state s ON ps.state_id = s.id
      WHERE wps.id IN (${statusIds.map(() => "?").join(",")})`,
		statusIds
	);

	const statusMap = new Map(statusRows.map((s) => [s.id, s]));

	// 3. Build remarks response
	return listRows.map((row) => {
		const status = statusMap.get(row.wfProvidedStatusId);
		const fullName =
			row.firstName && row.lastName ? `${row.firstName} ${row.lastName}` : "";

		return {
			actionTakenAt: row.createdAt,
			actioner: row.isAdmin ? "ADMIN" : status?.initiatorRoleName ?? "",
			state: status?.postLabel ?? "",
			remarks: row.remarks,
			createdBy: fullName,
		};
	});
}
