import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

// Dummy apps list
type App = {
  name: string;
  logo: string;
};

// Dummy apps
const apps: App[] = [
  { name: "Discord", logo: "/src/assets/logos/discord.png" },
  { name: "Gmail", logo: "/src/assets/logos/gmail_240.png" },
  { name: "GitHub", logo: "/src/assets/logos/github_240.png" },
  { name: "Slack", logo: "/src/assets/logos/slack.png" },
  { name: "Weather", logo: "/src/assets/logos/weather.png" },
];

export default function Apps() {
  const navigate = useNavigate();
  const [connectedApps, setConnectedApps] = useState<string[]>([]); // app names

  const handleConnect = (appName: string) => {
    // fake OAuth simulation
    const token = `${appName}_fake_token_${Date.now()}`;
    localStorage.setItem(`token_${appName}`, token);
    setConnectedApps((prev) => [...prev, appName]);
  };

  return (
    <div className="p-6 bg-accent min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Apps</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {apps.map((app) => {
          const isConnected =
            connectedApps.includes(app.name) ||
            !!localStorage.getItem(`token_${app.name}`);
          return (
            <div
              key={app.name}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer flex flex-col items-center p-6"
            >
              <img
                src={app.logo}
                alt={app.name}
                className="w-16 h-16 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold">{app.name}</h3>

              {isConnected ? (
                <Button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                  onClick={() => navigate(`/apps/${app.name}`)}
                >
                  View Details
                </Button>
              ) : (
                <Button
                  className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
                  onClick={() => handleConnect(app.name)}
                >
                  Connect
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
