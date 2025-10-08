import { API_ROUTES } from "../config/api";
import type { Area } from "../types";

interface CreateAreaPayload {
  action_uuid: string;
  reaction_uuid: string;
  user_uuid: string;
  name: string;
  description: string;
  enable: boolean;
  disabled_until: string | null;
}

export async function createAction(actionData: any) {
  const res = await fetch(API_ROUTES.actions.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(actionData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function createReaction(reactionData: any) {
  const res = await fetch(API_ROUTES.reactions.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reactionData),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Erreur API (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function getAreas(): Promise<Area[] | null> {
  const res = await fetch(API_ROUTES.area.get, {
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
export async function createArea(payload: CreateAreaPayload): Promise<Area> {
  const res = await fetch(API_ROUTES.area.create, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 404) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Action or Reaction not found");
  }

  if (!res.ok) {
    throw new Error(`Failed to create Area. Status: ${res.status}`);
  }

  const area: Area = await res.json();
  return area;
}
