import { useEffect } from "react";
import { useGitHubToken } from "../services/OAuth/OAuths/githubServices";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const { githubToken, loading, error } = useGitHubToken();
  const nav = useNavigate();
  useEffect(() => {
    if (githubToken) {
      localStorage.setItem("github_access_token", githubToken);
      nav("/create");
    }
  }, [githubToken, nav]);

  if (loading && !githubToken)
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  if (error && !githubToken)
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-4xl font-bold">Failed to connect to Github</p>
        <p className="text-2xl font-bold">Error: {error}</p>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-4xl font-bold">Connected to Github</p>
    </div>
  );
}
