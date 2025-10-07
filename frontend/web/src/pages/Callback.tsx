import { useEffect } from "react";
import { useGitHubToken } from "../services/OAuth/OAuths/githubServices";
import Loader from "../components/Loader";

export default function Callback() {
  const { data: githubToken, loading, error } = useGitHubToken();

  useEffect(() => {
    if (githubToken) {
      localStorage.setItem("github_access_token", githubToken);
      console.log("GitHub token stored in localStorage:", githubToken);
    }
  }, [githubToken]);

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
    <div className="w-full h-full flex items-center justify-center text-center mt-10">
      <h1>Callback</h1>
      {githubToken && <p>Github Token : {githubToken}</p>}
    </div>
  );
}
