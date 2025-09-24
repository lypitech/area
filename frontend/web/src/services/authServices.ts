import { API_ROUTES } from "../config/api";

export async function register(
  email: string,
  password: string,
  nickname: string,
  username: string,
  profile_picture: string | null = null
)
{
  const response = await fetch(API_ROUTES.auth.register, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name: nickname, username, profile_picture }),
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