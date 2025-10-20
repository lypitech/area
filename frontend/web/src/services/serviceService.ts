import { API_ROUTES } from "../config/api";
import type { Service } from "../types/index";

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
