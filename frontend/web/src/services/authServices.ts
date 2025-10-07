import { API_ROUTES } from "../config/api";
import { clearLocalStorage } from "../utils/auth";
import { getUser } from "./userServices";

export async function register(
  email: string,
  password: string,
  nickname: string,
  username: string,
  profile_picture: string | null = null
) {
  const response = await fetch(API_ROUTES.auth.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      nickname,
      username,
      profile_picture,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

export async function login(email: string, password: string) {
  const response = await fetch(API_ROUTES.auth.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

export async function refreshToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) throw new Error("No refresh token");

  const res = await fetch(API_ROUTES.auth.refresh, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) throw new Error("Failed to refresh token");
  const data = await res.json();

  localStorage.setItem("access_token", data.access_token);
  return data.access_token;
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    console.warn("No refresh token found, skipping logout request");
    clearLocalStorage();
    return;
  }

  try {
    const userData = await getUser();
    let uuid: string | null = null;

    if (typeof userData === "string") {
      console.error("Logout error:", userData);
    } else {
      uuid = userData.uuid;
    }

    if (uuid) {
      const res = await fetch(API_ROUTES.auth.logout, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid }),
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error(`Logout failed (${res.status}):`, msg);
      } else {
        console.log("User logged out successfully");
      }
    }
  } catch (err) {
    console.error("Unexpected logout error:", err);
  } finally {
    clearLocalStorage();
  }
}
