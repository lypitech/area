import { API_ROUTES } from "../config/api";
import type { Service } from "../types/index";

export async function getTrigger(user_uuid: string, area_uuid: string) {
  try {
    const response = await fetch(API_ROUTES.triggers.get(user_uuid, area_uuid), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trigger for area ${area_uuid}`);
    }

    const trigger = await response.json();
    return trigger;
  } catch (err) {
    console.error("Error fetching trigger:", err);
    throw err;
  }
}

export async function getResponse(user_uuid: string, area_uuid: string) {
  try {
    const response = await fetch(API_ROUTES.responses.get(user_uuid, area_uuid), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch response for area ${area_uuid}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error fetching response:", err);
    throw err;
  }
}

/**
 * Fetch all available actions and reactions from backend,
 * and group them by service.
 */
export async function getServices(): Promise<Service[]> {
  try {
    const response = await fetch(API_ROUTES.service.get(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const services = await response.json();

    if (!response.ok) {
      throw new Error("Failed to fetch selections");
    }

    return services;
  } catch (err) {
    console.error("Error fetching selections:", err);
    throw err;
  }
}
