import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUser } from "../../userService";
import { API_ROUTES } from "../../../config/api";

export function twitchLogin() {
  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = "http://localhost:8081/callback";

  const scopes = [
    "user:read:email",
    "user:read:subscriptions",
    "user:read:follows",
    "user:edit",
    "user:edit:follows",
    "clips:edit",
    "channel:manage:broadcast",
    "channel:manage:moderators",
    "channel:manage:polls",
    "channel:manage:predictions",
    "channel:manage:redemptions",
    "channel:manage:schedule",
    "channel:manage:videos",
    "channel:read:editors",
    "channel:read:hype_train",
    "channel:read:polls",
    "channel:read:predictions",
    "channel:read:redemptions",
    "channel:read:subscriptions",
    "moderation:read",
    "moderator:manage:banned_users",
    "moderator:read:chat_settings",
    "moderator:manage:chat_settings",
    "moderator:read:followers",
    "moderator:read:shoutouts",
    "moderator:manage:shoutouts",
    "chat:read",
    "chat:edit",
    "whispers:read",
    "whispers:edit",
  ];

  const twitchAuthUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scopes.join(" "))}&state=twitch`;

  localStorage.setItem("oauth_redirect_after", window.location.pathname);
  window.location.href = twitchAuthUrl;
}

export function useTwitchLogin() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = params.get("code");
    if (!code) return;

    const fetchToken = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ROUTES.auth.oauth('twitch'), {
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
