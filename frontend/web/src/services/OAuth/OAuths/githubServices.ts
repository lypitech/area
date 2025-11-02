import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getUser } from "../../userService";
import { API_ROUTES } from "../../../config/api";

export function githubLogin() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = "http://localhost:8081/callback";
  const scope = [
    "repo",
    "admin:repo_hook",
    "delete_repo",
    "admin:org_hook",
    "admin:public_key",
    "workflow",
    "write:packages",
    "delete:packages",
    "read:org",
    "user",
  ].join(" ");

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=github`;

  localStorage.setItem("oauth_redirect_after", window.location.pathname);
  window.location.href = githubAuthUrl;
}

export function useGithubLogin() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;

    const fetchToken = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ROUTES.auth.oauth('github'), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, front: true }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "OAuth login failed");
        }
        const data = await res.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [params]);

  return { loading, error };
}

export function useGitHubToken() {
  const [params] = useSearchParams();

  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUuid = localStorage.getItem("uuid");
        if (localUuid) {
          setUuid(localUuid);
          return;
        }

        const userData = await getUser();
        if (typeof userData === "string") {
          setError(userData);
          setUuid(null);
        } else {
          setUuid(userData.uuid);
          localStorage.setItem("uuid", userData.uuid);
        }
      } catch (err: any) {
        setError(err.message || "Failed to get user UUID");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const code = params.get("code");
    if (!code || !uuid) return;

    const fetchToken = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:8080/oauth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, uuid }),
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();

        if (data.token) {
          setGithubToken(data.token);
          localStorage.setItem("github_access_token", data.token);
        } else {
          setError("No access token returned");
        }
      } catch (err: any) {
        console.error("GitHub token error:", err);
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [uuid, params]);

  return { token:githubToken, loading, error };
}

