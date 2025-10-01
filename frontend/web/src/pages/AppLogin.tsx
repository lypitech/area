import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";

export default function AppLogin() {
  const navigate = useNavigate();
  const { appName } = useParams<{ appName: string }>(); // ex: "GitHub"

  if (!appName) return <div>App not found</div>;

  const storageKey = `token_${appName}`;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate OAuth flow: redirect + code -> token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (localStorage.getItem(storageKey)) {
      // already connected
      navigate("/create");
      return;
    }

    if (code) {
      setLoading(true);
      // Simulate token retrieval with code
      setTimeout(() => {
        const fakeToken = `${appName}_fake_token_${code}`;
        localStorage.setItem(storageKey, fakeToken);
        setLoading(false);
        navigate("/create");
      }, 1000);
    }
  }, [appName, navigate, storageKey]);

  const startOAuth = () => {
    setError(null);
    // Simulate redirection to service tiers
    const redirectUri = `${window.location.origin}/app-login/${appName}`;
    const clientId = "FAKE_CLIENT_ID"; // replace with real OAuth client id
    const oauthUrl = `https://example.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=read`;
    window.location.href = oauthUrl;
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-accent">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          {loading ? `Connecting to ${appName}...` : `Login to ${appName}`}
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!loading && (
          <Button
            className="w-full bg-black text-white font-semibold hover:opacity-90 transition"
            onClick={startOAuth}
          >
            Connect {appName}
          </Button>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Already connected?{" "}
          <span
            className="text-black font-semibold hover:underline cursor-pointer"
            onClick={() => navigate("/create")}
          >
            Go to Create
          </span>
        </p>
      </div>
    </div>
  );
}
