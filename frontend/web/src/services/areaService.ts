import { API_ROUTES } from "../config/api";
import type { Area } from "../types";
import { getUser } from "./userService";

export async function getAreas(): Promise<Area[] | null> {
  console.log("Fetching areas...");


  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    await getUser();
    uuid = localStorage.getItem("uuid");
  }

  const res = await fetch(API_ROUTES.area.getUserAreas(uuid || ""), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API (${res.status}): ${errorText}`);
  }

  const area: Area[] | null = await res.json();
  return area;
}

export async function createArea(
  name: string,
  description: string,
  selectedAction: any,
  selectedReaction: any,
  selectedActionService: any,
  selectedReactionService: any,
  userUuid: string,
  input: any,
  resourceId: Record<string, string>,
  reactionPayload: string
): Promise<Area> {

  if (!selectedAction || !selectedReaction) {
    throw new Error("Both action and reaction must be selected before creating an Area");
  }

  const payload = {
    trigger: {
      service_name: selectedActionService.name,
      name: selectedAction.name,
      description: selectedAction.description,
      input: input,
      trigger_type: selectedAction.trigger_types.toString(),
    },
    response: {
      service_name: selectedReactionService.name,
      name: selectedReaction.name,
      description: selectedReaction.description,
      resource_ids: resourceId,
      payload: reactionPayload,
    },
    user_uuid: userUuid,
    name,
    description,
    enabled: true,
    disabled_until: null,
  };

  console.log("Creating Area...", payload);
  const res = await fetch(API_ROUTES.area.create(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.status === 404) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Action or Reaction not found");
  }

  if (!res.ok) {
    throw new Error(`Failed to create Area. Status: ${res.status}`);
  }

  return res.json();
}

export async function deleteArea(id: string): Promise<void> {
  const res = await fetch(API_ROUTES.area.deleteAreaByUUID(id), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete Area. Status: ${res.status}`);
  }
}
