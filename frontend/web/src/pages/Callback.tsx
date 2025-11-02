import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

import {
  useGithubLogin,
  useGitHubToken,
} from "../services/OAuth/OAuths/githubServices";
import {
  useTwitchLogin,
  useTwitchToken,
} from "../services/OAuth/OAuths/twitchServices";

export default function Callback() {
  const [params] = useSearchParams();
  const provider = params.get("state");
  const nav = useNavigate();

  const hooks = {
    github: useGitHubToken,
    twitch: useTwitchToken,
  };

  const loginHooks = {
    github: useGithubLogin,
    twitch: useTwitchLogin,
  };

  const useProviderHook = hooks[provider as keyof typeof hooks];
  if (!useProviderHook)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-2xl font-bold">Invalid OAuth provider</p>
      </div>
    );

  console.log(localStorage.getItem(`oauth_redirect_after`));
  if (localStorage.getItem(`oauth_redirect_after`) === "/") {
    loginHooks[provider as keyof typeof loginHooks]();
    useEffect(() => {
      nav("/home");
    }, [localStorage.getItem(`access_token`)]);
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const { token, loading, error } = useProviderHook();

  useEffect(() => {
    if (token) {
      localStorage.setItem(`${provider}_access_token`, token);

      const redirectPath =
        localStorage.getItem("oauth_redirect_after") || "/create";
      localStorage.removeItem("oauth_redirect_after");

      if (redirectPath.includes("/create")) {
        nav("/create");
      } else {
        nav(redirectPath);
      }
    }
  }, [token, provider, nav]);

  if (loading && !token)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );

  if (error && !token)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-4xl font-bold">Failed to connect to {provider}</p>
        <p className="text-2xl font-bold">Error: {error}</p>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-4xl font-bold">Connected to {provider}</p>
    </div>
  );
}
