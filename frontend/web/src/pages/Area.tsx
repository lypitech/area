import { useState } from "react";
import Input from "../components/Input";

type Area = {
  uuid: string;
  name: string;
  description: string;
  creation_date: string;
  enable: boolean;
  action: { service_name: string; logo: string };
  reaction: { service_name: string; logo: string };
};

// Example dummy data
const dummyAreas: Area[] = [
  {
    uuid: "1",
    name: "Discord → Gmail",
    description: "Send Gmail when a Discord message is posted",
    creation_date: "2025-10-01",
    enable: true,
    action: { service_name: "Discord", logo: "/src/assets/logos/discord.png" },
    reaction: {
      service_name: "Gmail",
      logo: "/src/assets/logos/gmail_240.png",
    },
  },
  {
    uuid: "2",
    name: "GitHub → Discord",
    description: "Notify Slack when a new GitHub issue is opened",
    creation_date: "2025-09-28",
    enable: true,
    action: {
      service_name: "GitHub",
      logo: "/src/assets/logos/github_240.png",
    },
    reaction: {
      service_name: "discord",
      logo: "/src/assets/logos/discord.png",
    },
  },
  {
    uuid: "3",
    name: "0°C → Gmail",
    description: "Send an email when temperature is below 0°C",
    creation_date: "2025-09-20",
    enable: false,
    action: { service_name: "Weather", logo: "/src/assets/logos/weather.png" },
    reaction: {
      service_name: "Gmail",
      logo: "/src/assets/logos/gmail_240.png",
    },
  },
];

export default function Areas() {
  const [search, setSearch] = useState("");

  const filteredAreas = dummyAreas.filter((area) =>
    area.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-accent min-h-screen">
      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <Input
          iconName="search"
          placeholder="Search Areas..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          inputClass="max-w-lg w-full"
        />
      </div>

      {/* Area Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAreas.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No areas found
          </p>
        )}

        {filteredAreas.map((area) => (
          <div
            key={area.uuid}
            className={`bg-white rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer flex flex-col justify-between`}
          >
            <div>
              {/* Name */}
              <h3 className="text-lg font-bold">{area.name}</h3>
              {/* Description */}
              <p className="text-gray-600 mt-2">{area.description}</p>

              {/* Workflow preview */}
              <div className="flex items-center justify-between mt-4">
                {/* Action */}
                <div className="flex flex-col items-center">
                  <img
                    src={area.action.logo}
                    alt={area.action.service_name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs mt-1">
                    {area.action.service_name}
                  </span>
                </div>

                {/* Connector arrow */}
                <div className="flex-1 mx-2 h-1 relative">
                  <div className="absolute top-1/2 left-0 w-full border-t border-gray-300 transform -translate-y-1/2" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14m0 0l-4-4m4 4l-4 4"
                      />
                    </svg>
                  </div>
                </div>

                {/* Reaction */}
                <div className="flex flex-col items-center">
                  <img
                    src={area.reaction.logo}
                    alt={area.reaction.service_name}
                    className="w-12 h-12 object-contain"
                  />
                  <span className="text-xs mt-1">
                    {area.reaction.service_name}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{area.creation_date}</span>
              <span
                className={`px-2 py-1 rounded-full text-white text-xs ${
                  area.enable ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {area.enable ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
