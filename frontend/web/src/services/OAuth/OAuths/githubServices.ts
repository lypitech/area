import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { User } from "../../../types";
import { getUser } from "../../userServices";

export function githubLogin() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = "http://localhost:5173/callback";
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
  window.location.href = githubAuthUrl;
}

export function useGitHubToken() {
  const [params] = useSearchParams();

  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (typeof userData === "string") {
        setError(userData);
        setUser(null);
      } else {
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const code = params.get("code");

    if (!code || !user) return;

    const fetchToken = async () => {
      setLoading(true);
      try {
        console.log("UUID:", user.uuid);
        const res = await fetch("http://localhost:8080/auth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, uuid: user.uuid }),
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();
        console.log("GitHub API response:", data);

        if (data.accessToken) setData(data.accessToken);
        else setError("No access token returned");
      } catch (err: any) {
        console.error("GitHub token error:", err);
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [params, user]);

  return { data, loading, error };
}
