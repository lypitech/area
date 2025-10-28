import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { getLogo } from "../utils/getLogo";
import type { Service } from "../types";

export default function AppDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const appData: Service = state;

  if (!appData || !appData.name) return <div>App not found</div>;

  return (
    <div className="p-8 bg-accent min-h-screen ">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-4 pb-6">
          <img
            src={getLogo(appData.name.toLowerCase())}
            alt={appData.name}
            className="w-16 h-16"
          />
          <h1 className="text-3xl font-bold">{appData.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Actions</h2>
            {appData.actions && appData.actions.length > 0 ? (
              appData.actions.map((a: any) => (
                <div
                  key={a.uuid || a.name}
                  className="p-3 mb-2 bg-gray-50 rounded shadow hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-medium">{a.name}</p>
                  {a.description && (
                    <p className="text-sm text-gray-600">{a.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No actions available</p>
            )}
          </div>

          {/* Reactions */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Reactions</h2>
            {appData.reactions && appData.reactions.length > 0 ? (
              appData.reactions.map((r: any) => (
                <div
                  key={r.uuid || r.name}
                  className="p-3 mb-2 bg-gray-50 rounded shadow hover:bg-gray-100 cursor-pointer"
                >
                  <p className="font-medium">{r.name}</p>
                  {r.description && (
                    <p className="text-sm text-gray-600">{r.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reactions available</p>
            )}
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
