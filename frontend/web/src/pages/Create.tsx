import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import type { ActionSelection, ReactionSelection } from "../types/index";
import OAuthParser from "../services/OAuth/oauthParser";
import { fetchSelections } from "../services/areaSelectionsServices";

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
    const fetchApps = async () => {
      const apps = await fetchSelections();
      setApps(apps);
    };

    fetchApps();
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

  const handleSelectReaction = (tmpReaction: ReactionSelection) => {
    setSelectedReaction({
      uuid: tmpReaction.uuid,
      service_name: tmpReaction.service_name.toLowerCase(),
      name: tmpReaction.name.toLowerCase(),
      description: tmpReaction.description,
      service_resource_id: "",
      payload: "",
    });

    if (!selectedReaction?.service_resource_id) {
      setModalOpen(true);
    }
  };

  const handleActionClick = (action: ActionSelection) => {
    setSelectedAction({
      uuid: action.uuid,
      service_name: action.service_name,
      name: action.name,
      description: action.description,
      area_uuid: "",
      service_resource_id: "",
      token: "",
      oauth_token_id: "",
      trigger_type: "interval",
      every_minutes: 1,
    });
  };

  const saveReactionInput = () => {
    if (selectedReaction) {
      setSelectedReaction({
        ...selectedReaction,
        service_resource_id: reactionInput,
      });
    }
    setReactionInput("");
    setModalOpen(false);
  };

  const saveArea = async () => {
    if (!selectedAction || !selectedReaction || !user) return;

    try {
      console.log("Creating area...");
      const actionPayload = {
        action: {
          service_name: selectedAction.service_name,
          every_minutes: selectedAction.every_minutes,
          name: selectedAction.name,
          description: selectedAction.description,
          oauth_token_id: selectedAction.oauth_token_id || null,
          trigger_type: selectedAction.trigger_type,
        },
        parameters: {
          owner: "my-org",
          repo: "my-repo",
          userId: user.uuid,
        },
      };

      const createdAction = await createAction(actionPayload);
      console.log("Action payload:", actionPayload);
      console.log("Action créée :", createdAction);

      const reactionPayload = {
        service_name: selectedReaction.service_name,
        name: selectedReaction.name,
        service_resource_id: selectedReaction.service_resource_id || null,
        description: selectedReaction.description,
        payload: selectedReaction.payload || "{}",
      };

      const createdReaction = await createReaction(reactionPayload);
      console.log("Reaction créée :", createdReaction);

      const areaPayload = {
        action_uuid: createdAction.uuid,
        reaction_uuid: createdReaction.uuid,
        user_uuid: user.uuid,
        name: `${selectedAction.name} -> ${selectedReaction.name}`,
        description: `Automation: ${selectedAction.name} triggers ${selectedReaction.name}`,
        enable: true,
        disabled_until: null,
      };

      const createdArea = await createArea(areaPayload);
      console.log("Area créée :", createdArea);
      alert("AREA créée avec succès !");
    } catch (err: any) {
      console.error("Erreur création Area :", err);
      alert(`Échec de création : ${err.message}`);
    }
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
