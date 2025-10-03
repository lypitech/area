import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useState, useEffect } from "react";

// Dummy actions/reactions
const appData: Record<
  string,
  { actions: string[]; reactions: string[]; logo: string }
> = {
  Discord: {
    logo: "/src/assets/logos/discord.png",
    actions: ["New message in channel", "User joined server"],
    reactions: ["Send message", "Kick user"],
  },
  Gmail: {
    logo: "/src/assets/logos/gmail_240.png",
    actions: ["New email received", "Label applied"],
    reactions: ["Send email", "Mark as read"],
  },
  GitHub: {
    logo: "/src/assets/logos/github_240.png",
    actions: ["New issue", "New pull request"],
    reactions: ["Create issue", "Comment on PR"],
  },
  Slack: {
    logo: "/src/assets/logos/slack.png",
    actions: ["New message posted", "User joined channel"],
    reactions: ["Send message", "Invite user"],
  },
};

export default function AppDetails() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!serviceName) return;
    const token = localStorage.getItem(`token_${serviceName}`);
    setIsConnected(!!token);
  }, [serviceName]);

  if (!serviceName || !appData[serviceName]) return <div>App not found</div>;

  const data = appData[serviceName];

  const handleConnect = () => {
    const token = `${serviceName}_fake_token_${Date.now()}`;
    localStorage.setItem(`token_${serviceName}`, token);
    setIsConnected(true);
  };

  return (
    <div className="p-6 bg-accent min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={data.logo} alt={serviceName} className="w-16 h-16" />
          <h1 className="text-3xl font-bold">{serviceName}</h1>
        </div>

        {!isConnected ? (
          <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold mb-6"
            onClick={handleConnect}
          >
            Connect {serviceName}
          </Button>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Actions</h2>
            {data.actions.map((a) => (
              <div
                key={a}
                className="p-3 mb-2 bg-gray-50 rounded shadow hover:bg-gray-100 cursor-pointer"
              >
                {a}
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Reactions</h2>
            {data.reactions.map((r) => (
              <div
                key={r}
                className="p-3 mb-2 bg-gray-50 rounded shadow hover:bg-gray-100 cursor-pointer"
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <Button
          className="mt-6 w-full bg-black text-white font-semibold"
          onClick={() => navigate("/apps")}
        >
          Back to Apps
        </Button>
      </div>
    </div>
  );
}
