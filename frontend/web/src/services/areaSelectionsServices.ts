import { API_ROUTES } from "../config/api";
import type { ActionSelection, ReactionSelection } from "../types/index";

export type AppState = {
  service_name: string;
  logo?: string;
  connected: boolean;
  actions?: ActionSelection[];
  reactions?: ReactionSelection[];
};

/**
 * Fetch all available actions and reactions from backend,
 * and group them by service.
 */
export async function fetchSelections(): Promise<AppState[]> {
  try {
    const [actionsRes, reactionsRes] = await Promise.all([
      fetch(API_ROUTES.list.actions, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      fetch(API_ROUTES.list.reactions, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    ]);

    if (!actionsRes.ok || !reactionsRes.ok)
      throw new Error("Failed to fetch selections");

    const actions: ActionSelection[] = await actionsRes.json();
    const reactions: ReactionSelection[] = await reactionsRes.json();

    const serviceNames = Array.from(
      new Set([
        ...actions.map((a) => a.service_name),
        ...reactions.map((r) => r.service_name),
      ])
    );

    const appsData: AppState[] = serviceNames.map((service) => ({
      service_name: service,
      connected: false,
      actions: actions.filter((a) => a.service_name === service),
      reactions: reactions.filter((r) => r.service_name === service),
    }));

    return appsData;
  } catch (err) {
    console.error("Error fetching selections:", err);
    throw err;
  }
}
