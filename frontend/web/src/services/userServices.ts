import { API_ROUTES } from "../config/api";
import type { User } from "../types/index";

/**
 * Retrieve user information from the backend.
 * Returns a User object or an error message.
 */
export async function getUser(): Promise<User | string> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.warn("No refresh token found in localStorage");
    return "No refresh token";
  }

  console.log("Refresh token:", refreshToken);
  try {
    const res = await fetch(`${API_ROUTES.user.getUser}/${refreshToken}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`HTTP error ${res.status}: ${text}`);
      return `Failed to get user (${res.status})`;
    }

    const data: User = await res.json();
    return data;
  } catch (err: any) {
    console.error("Error retrieving user:", err);
    return err.message || "Unexpected error";
  }
}
