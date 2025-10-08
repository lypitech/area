import { useEffect, useState } from "react";
import { getAreas } from "../services/areaServices";
import type { Area } from "../types";

export default function Apps() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await getAreas();
        setAreas(data || []);
      } catch (error) {
        console.error("Error while loading areas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading automations...</p>
      </div>
    );
  }

  if (areas.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Areas</h1>
        <p className="text-gray-500">No automations created yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-accent min-h-screen">
      <h1 className="text-3xl font-bold mb-8">My Automations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {areas.map((area) => {
          const isDisabled =
            !area.enable ||
            (area.disabled_until && new Date(area.disabled_until) > new Date());

          return (
            <div
              key={area.uuid}
              className={`rounded-2xl shadow-lg border transition p-6 flex flex-col justify-between ${
                isDisabled
                  ? "bg-gray-100 border-gray-300"
                  : "bg-white hover:shadow-xl border-gray-200"
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {area.name}
                  </h3>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      isDisabled
                        ? "bg-gray-300 text-gray-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {isDisabled ? "Disabled" : "Active"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {area.description || "No description provided"}
                </p>

                {/* Info section */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <span className="font-medium text-gray-700">
                      Created on:
                    </span>{" "}
                    {new Date(area.creation_date).toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
