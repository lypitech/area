import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import type { ActionSelection, ReactionSelection } from "../types/index";
import { API_ROUTES } from "../config/api";
import { githubLogin } from "../services/OAuth/OAuths/githubServices";
import OAuthParser from "../services/OAuth/oauthParser";

type AppState = {
  service_name: string;
  logo?: string;
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

  const [apps, setApps] = useState<AppState[]>([]);

  // --- Fetch all action/reaction selections ---
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const [actionsRes, reactionsRes] = await Promise.all([
          fetch(API_ROUTES.selection.actions, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
          fetch(API_ROUTES.selection.reactions, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!actionsRes.ok || !reactionsRes.ok)
          throw new Error("Failed to fetch selections");

        const actions: ActionSelection[] = await actionsRes.json();
        const reactions: ReactionSelection[] = await reactionsRes.json();

        console.log(actions);
        console.log(reactions);

        // Créer la liste unique des services
        const serviceNames = Array.from(
          new Set([
            ...actions.map((a) => a.service_name),
            ...reactions.map((r) => r.service_name),
          ])
        );

        // Associer actions et reactions à chaque service
        const appsData: AppState[] = serviceNames.map((service) => ({
          service_name: service,
          connected: false,
          actions: actions.filter((a) => a.service_name === service),
          reactions: reactions.filter((r) => r.service_name === service),
        }));

        setApps(appsData);
      } catch (err) {
        console.error("Error fetching selections:", err);
      }
    };

    fetchSelections();
  }, []);

  const handleAppClick = (app: AppState) => {
    const token = localStorage.getItem(`${app.service_name}_access_token`);
    if (!token) {
      if (OAuthParser(app.service_name) == "unknown") {
        alert("Unknown service");
        return;
      }
      return;
    }

    setApps((prev) =>
      prev.map((a) =>
        a.service_name === app.service_name ? { ...a, connected: true } : a
      )
    );
  };

  const saveArea = () => {
    if (!selectedAction || !selectedReaction) return;
    console.log("Saving AREA:", { selectedAction, selectedReaction });

    // TODO: POST areas
  };

  const blocks = [
    { id: "action", label: "Action", top: 40, left: 15 },
    { id: "reaction", label: "Reaction", top: 40, left: 60 },
  ];

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
                className={`flex w-full items-center gap-3 p-2 rounded-xl transition-all duration-150 outline outline-gray-200
                ${
                  app.connected
                    ? "bg-green-50 hover:shadow-xl"
                    : "bg-white hover:bg-gray-50"
                }`}
                onClick={() => handleAppClick(app)}
              >
                {/* Logo temporairement omis */}
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
                  {app.service_name[0]}
                </div>
                <span className="font-semibold">{app.service_name}</span>
              </button>

              {/* Actions */}
              {app.connected &&
                selectedBlock === "action" &&
                app.actions &&
                app.actions.length > 0 && (
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

              {/* Reactions */}
              {app.connected &&
                selectedBlock === "reaction" &&
                app.reactions &&
                app.reactions.length > 0 && (
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
