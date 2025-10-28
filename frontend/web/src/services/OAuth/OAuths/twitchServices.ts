import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUser } from "../../userService";

export function twitchLogin() {
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = "http://localhost:8081/callback";
  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=user:read:email&state=twitch`;
  window.location.href = twitchAuthUrl;
}

export function useTwitchToken() {
  const [params] = useSearchParams();
  const [twitchToken, setTwitchToken] = useState<string | null>(null);
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

        const res = await fetch("http://localhost:8080/oauth/twitch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, uuid }),
        });

        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();

        if (data.token) {
          setTwitchToken(data.token);
          localStorage.setItem("twitch_access_token", data.token);
        } else {
          setError("No access token returned");
        }
      } catch (err: any) {
        console.error("Twitch token error:", err);
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [uuid, params]);

  return { token: twitchToken, loading, error };
}
