import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../services/serviceService";
import { useArea } from "../context/AreaContext";
import { Button } from "../components/Button";
import { getLogo } from "../utils/getLogo";

export default function Create() {
  const nav = useNavigate();

  const {
    selectedAction,
    selectedReaction,
    selectedActionService,
    selectedReactionService,
    setServices,
  } = useArea();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const blocks = [
    { id: "action", label: "Action", top: 40, left: 15 },
    { id: "reaction", label: "Reaction", top: 40, left: 60 },
  ];

  return (
    <div className="relative flex flex-col w-full h-screen bg-accent">
      {/* CANVAS */}
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Create an area</h1>
      </div>
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
      {blocks.map((block) => (
        <div
          key={block.id}
          className="flex flex-row h-20 items-center justify-between absolute bg-white border rounded p-4 py-6 cursor-pointer shadow-2xl hover:shadow-xl transition"
          style={{
            top: `${block.top}%`,
            left: `${block.left}%`,
            width: "20%",
            minWidth: "150px",
          }}
          onClick={() => nav(`/create/${block.id}`)}
        >
          {block.label}
          {block.id === "action" && selectedAction && (
            <img
              src={getLogo(
                selectedActionService?.name.toLocaleLowerCase() || ""
              )}
              alt={selectedActionService?.name}
              className="w-10 h-10 object-contain rounded-full"
            />
          )}
          {block.id === "reaction" && selectedReaction && (
            <img
              src={getLogo(
                selectedReactionService?.name.toLocaleLowerCase() || ""
              )}
              alt={selectedReactionService?.name}
              className="w-10 h-10 object-contain rounded-full"
            />
          )}
        </div>
      ))}
      {selectedAction && selectedReaction && (
        <div className="w-full h-full flex justify-center items-baseline-last p-8">
          <Button
            className="w-50 h-16 bg-black hover:scale-105 hover:bg-neutral-700 transition ease-in-out duration-300"
            onClick={() => nav("save")}
          >
            <p className="text-xl text-white">Save your Area</p>
          </Button>
        </div>
      )}
    </div>
  );
}
