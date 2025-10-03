import { useState } from "react";
import { Button } from "../components/Button";

// Types (temporary)
type ActionSelection = {
  uuid: string;
  service_name: string;
  name: string;
  description: string;
  trigger_types: string[];
};

type ReactionSelection = {
  uuid: string;
  service_name: string;
  name: string;
  description: string;
  schema_input: string;
};

type AppState = {
  service_name: string;
  logo: string;
  connected: boolean;
  actions?: ActionSelection[];
  reactions?: ReactionSelection[];
};

export default function Create() {
  const [selectedBlock, setSelectedBlock] = useState<
    "action" | "reaction" | null
  >(null);
  const [selectedAction, setSelectedAction] = useState<ActionSelection | null>(
    null
  );
  const [selectedReaction, setSelectedReaction] =
    useState<ReactionSelection | null>(null);

  // Apps
  const [apps, setApps] = useState<AppState[]>([
    {
      service_name: "Discord",
      logo: "/src/assets/logos/discord.png",
      connected: false,
    },
    {
      service_name: "Gmail",
      logo: "/src/assets/logos/gmail_240.png",
      connected: false,
    },
    {
      service_name: "GitHub",
      logo: "/src/assets/logos/github_240.png",
      connected: false,
    },
  ]);

  // Whiteboard blocks (responsive positions en %)
  const blocks = [
    { id: "action", label: "Action", top: 40, left: 15 },
    { id: "reaction", label: "Reaction", top: 40, left: 60 },
  ];

  const handleAppClick = (app: AppState) => {
    const token = localStorage.getItem(`token_${app.service_name}`);
    if (!token) {
      window.location.href = `/app-login/${app.service_name}`;
      return;
    }

    // If connected, show blocks
    if (selectedBlock === "action") {
      const actions: ActionSelection[] = [
        {
          uuid: "1",
          service_name: app.service_name,
          name: "Message Received",
          description: "Trigger on message received",
          trigger_types: ["webhook"],
        },
        {
          uuid: "2",
          service_name: app.service_name,
          name: "New Channel",
          description: "Trigger on new channel",
          trigger_types: ["polling"],
        },
      ];
      setApps((prev) =>
        prev.map((a) =>
          a.service_name === app.service_name ? { ...a, actions } : a
        )
      );
    } else if (selectedBlock === "reaction") {
      const reactions: ReactionSelection[] = [
        {
          uuid: "1",
          service_name: app.service_name,
          name: "Send Message",
          description: "Send a message",
          schema_input: "{}",
        },
        {
          uuid: "2",
          service_name: app.service_name,
          name: "Create Repo",
          description: "Create a repo",
          schema_input: "{}",
        },
      ];
      setApps((prev) =>
        prev.map((a) =>
          a.service_name === app.service_name ? { ...a, reactions } : a
        )
      );
    }
  };

  const saveArea = () => {
    if (!selectedAction || !selectedReaction) return;
    console.log("Saving AREA:", { selectedAction, selectedReaction });
    // TODO: POST to back
  };

  return (
    <div className="relative w-full h-screen bg-accent flex">
      {/* CANVAS */}
      <div className="flex-1 relative">
        {/* Connector line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${blocks[0].left + 10}%`}
            y1={`${blocks[0].top + 4}%`}
            x2={`${blocks[1].left + 10}%`}
            y2={`${blocks[1].top + 4}%`}
            stroke="black"
            strokeWidth={2}
          />
        </svg>

        {/* Blocks */}
        {blocks.map((block) => (
          <div
            key={block.id}
            className={`absolute bg-white border rounded p-4 py-6 cursor-pointer shadow-2xl hover:shadow-xl transition`}
            style={{
              top: `${block.top}%`,
              left: `${block.left}%`,
              width: "20%",
              minWidth: "150px",
            }}
            onClick={() =>
              setSelectedBlock(
                selectedBlock === block.id
                  ? null
                  : (block.id as "action" | "reaction")
              )
            }
          >
            {block.label}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      {selectedBlock && (
        <div className="w-80 flex flex-col bg-white border-l border-gray-200 p-4 gap-4 shadow-lg overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">
            {selectedBlock === "action" ? "Select Action" : "Select Reaction"}
          </h2>

          {apps.map((app) => (
            <div key={app.service_name}>
              <button
                className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-150 outline outline-gray-200
                ${
                  app.connected
                    ? "bg-green-50 hover:shadow-xl"
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleAppClick(app)}
              >
                <img
                  src={app.logo}
                  alt={app.service_name}
                  className="w-10 h-10 object-contain"
                />
                <span className="font-semibold">{app.service_name}</span>
              </button>

              {/* Actions / Reactions */}
              {app.connected && selectedBlock === "action" && app.actions && (
                <div className="ml-4 mt-2 flex flex-col gap-2">
                  {app.actions.map((act) => (
                    <Button
                      key={act.uuid}
                      onClick={() => setSelectedAction(act)}
                      className={`p-2 rounded hover:bg-gray-100 ${
                        selectedAction?.uuid === act.uuid
                          ? "bg-blue-50 shadow"
                          : ""
                      }`}
                    >
                      {act.name}
                    </Button>
                  ))}
                </div>
              )}

              {app.connected &&
                selectedBlock === "reaction" &&
                app.reactions && (
                  <div className="ml-4 mt-2 flex flex-col gap-2">
                    {app.reactions.map((react) => (
                      <Button
                        key={react.uuid}
                        onClick={() => setSelectedReaction(react)}
                        className={`p-2 rounded hover:bg-gray-100 ${
                          selectedReaction?.uuid === react.uuid
                            ? "bg-green-50 shadow"
                            : ""
                        }`}
                      >
                        {react.name}
                      </Button>
                    ))}
                  </div>
                )}
            </div>
          ))}

          {/* Save AREA button */}
          {selectedAction && selectedReaction && (
            <Button
              onClick={saveArea}
              className="mt-4 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            >
              Save AREA
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
