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

  try {
    const res = await fetch(`${API_ROUTES.user.getUser(refreshToken)}`, {
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

    // Store the user's UUID in localStorage
    localStorage.setItem("uuid", data.uuid);

    return data;
  } catch (err: any) {
    console.error("Error retrieving user:", err);
    return err.message || "Unexpected error";
  }
}

// export async function updateUser(user: User) {
//   const res = await fetch(API_ROUTES.user.updateUser(user), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   });
