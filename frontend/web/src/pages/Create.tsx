import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../services/serviceService";
import { useArea } from "../context/AreaContext";
import { Button } from "../components/Button";
import Footer from "../components/Footer";

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
        console.log(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-accent">
      {/* Header */}
      <div className="flex flex-col w-full justify-baseline p-8">
        <h1 className="text-4xl font-bold mb-8">Create an area</h1>
      </div>

      {/* Canvas zone */}
      <div className="flex flex-1 flex-row justify-between items-center w-2/3 transform -translate-y-12">
        {/* Action block */}
        <div
          onClick={() => nav(`/create/action`)}
          className="flex flex-col justify-center bg-white border rounded-xl cursor-pointer shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 w-80 h-24"
        >
          {selectedAction ? (
            <div className="flex flex-row items-center p-4 gap-4">
              <img
                src={`data:image/png;base64,${selectedActionService?.icon}`}
                alt={selectedActionService?.name}
                className="w-12 h-12 object-contain rounded-full"
              />
              <p className="text-center text-xl font-medium text-gray-700">
                {selectedAction?.name}
              </p>
            </div>
          ) : (
            <p className="text-center text-2xl font-medium text-gray-700">
              Choose your action
            </p>
          )}
        </div>

        {/* Connector line */}
        <div className="flex-1 border-t-2 border-black" />

        {/* Reaction block */}
        <div
          onClick={() => nav(`/create/reaction`)}
          className="flex flex-col justify-center bg-white border rounded-xl cursor-pointer shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 w-80 h-24"
        >
          {selectedReaction ? (
            <div className="flex flex-row items-center p-4 gap-4">
              <img
                src={`data:image/png;base64,${selectedReactionService?.icon}`}
                alt={selectedReactionService?.name}
                className="w-12 h-12 object-contain rounded-full"
              />
              <p className="text-center text-xl font-medium text-gray-700">
                {selectedReaction?.name}
              </p>
            </div>
          ) : (
            <p className="text-center text-2xl font-medium text-gray-700">
              Choose your reaction
            </p>
          )}
        </div>
      </div>

      {/* Save button */}
      {selectedAction && selectedReaction && (
        <div className="flex justify-center mb-12">
          <Button
            className="px-10 py-4 bg-black hover:scale-105 hover:bg-neutral-700 transition ease-in-out duration-300"
            onClick={() => nav("save")}
          >
            <p className="text-xl text-white">Save your Area</p>
          </Button>
        </div>
      )}
      <Footer />
    </div>
  );
}
