import { userPrimsa } from "@shared/prisma";

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
	console.log(initiatorRoleId)
  const isWorkFlowExist = await userPrimsa.work_flow.findFirst({
    where: { role_id: initiatorRoleId, process_id: PROCESS_ID, is_active: true },
  });
  if (!isWorkFlowExist) throw new Error("WorkFlowNotFound");

	console.log(isWorkFlowExist);
	

  const initiateState = await userPrimsa.work_flow_state.findFirst({
    where: { name: "initiate", is_active: true },
  });
  if (!initiateState) throw new Error("InitiateStateNotFound");
	// console.log(initiateState);
	

  const processState = await userPrimsa.work_flow_process_state.findFirst({
    where: {
      process_id: PROCESS_ID,
      state_id: initiateState.id,
      is_active: true,
    },
  });
  if (!processState) throw new Error("ProcessStateNotFound");

  const providedStatus = await userPrimsa.work_flow_provided_status.findFirst({
    where: { initiator: initiatorRoleId, process_state_id: processState.id, is_active: true },
  });
  if (!providedStatus) throw new Error("WorkFlowProvideStatusNotFound");

  let statusText = status;
  if (!statusText || !statusText.trim()) {
    const statusRecord = await userPrimsa.status_master.findFirst({
      where: { id: providedStatus.status_id || undefined, is_active: true },
    });
    statusText = statusRecord?.status || "";
  }

  const wfRequest = await userPrimsa.work_flow_request.create({
    data: {
      process_id: PROCESS_ID,
      active_provided_status: providedStatus.id,
      is_open: providedStatus.is_open ?? true,
      initiator: initiatorRoleId,
      created_by: userId,
      status: statusText,
    }
  });

  await userPrimsa.work_flow_request_list.create({
    data: {
      wf_request_id: wfRequest.id,
      wf_provided_status_id: wfRequest.active_provided_status,
      remarks: remarks ?? null,
      created_by: userId,
    }
  });

  return wfRequest.id;
}
