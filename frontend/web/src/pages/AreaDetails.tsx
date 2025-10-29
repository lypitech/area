import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
import { getTrigger, getResponse } from "../services/serviceService";
import Modal from "../components/Modal";
import { deleteArea } from "../services/areaService";

export default function AreaDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const area: any = state;
  const [trigger, setTrigger] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!area || !area.user_uuid || !area.uuid) return;

    (async () => {
      try {
        const [triggerData, responseData] = await Promise.all([
          getTrigger(area.user_uuid, area.uuid),
          getResponse(area.user_uuid, area.uuid),
        ]);
        setTrigger(triggerData);
        setResponse(responseData);
      } catch (err) {
        console.error("Failed to fetch trigger/response:", err);
      }
    })();
  }, [area]);

  if (!area || !area.name) return <div>Area not found</div>;

  return (
    <div className="p-8 bg-accent min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-3xl font-bold">{area.name}</h1>
          <Button
            className="bg-black text-white px-4 py-2 rounded-md font-semibold"
            onClick={() => setIsEditOpen(true)}
          >
            Edit
          </Button>
        </div>

        {area.description && (
          <p className="text-gray-700 mb-6">{area.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Trigger</h2>
            {trigger ? (
              <div className="p-3 mb-2 bg-gray-50 rounded shadow">
                <p className="font-medium">{trigger.name}</p>
                {trigger.description && (
                  <p className="text-sm text-gray-600">{trigger.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Type: {trigger.type}
                </p>
                {trigger.every_minute && (
                  <p className="text-xs text-gray-500">
                    Interval: {trigger.every_minute} minute(s)
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No trigger available</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Response</h2>
            {response ? (
              <div className="p-3 mb-2 bg-gray-50 rounded shadow">
                <p className="font-medium">{response.name}</p>
                {response.description && (
                  <p className="text-sm text-gray-600">
                    {response.description}
                  </p>
                )}
                {response.payload && (
                  <p className="text-xs text-gray-500 mt-2">
                    Payload: {response.payload}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No response available</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <p>
            Status:{" "}
            <span className={area.enabled ? "text-green-600" : "text-red-600"}>
              {area.enabled ? "Enabled" : "Disabled"}
            </span>
          </p>
          {area.disabled_until && (
            <p>
              Disabled until: {new Date(area.disabled_until).toLocaleString()}
            </p>
          )}
          <p>Created at: {new Date(area.createdAt).toLocaleString()}</p>
          <p>Updated at: {new Date(area.updatedAt).toLocaleString()}</p>
        </div>

        <Button
          className="mt-6 w-full bg-black text-white font-semibold"
          onClick={() => navigate("/area")}
        >
          Back to Areas
        </Button>
      </div>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        <h2 className="text-2xl font-semibold mb-4">Edit Area</h2>
        <form className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span className="font-semibold text-sm mb-1">Name</span>
            <input
              type="text"
              defaultValue={area.name}
              className="border rounded p-2"
            />
          </label>

          <label className="flex flex-col">
            <span className="font-semibold text-sm mb-1">Description</span>
            <textarea
              defaultValue={area.description}
              className="border rounded p-2"
              rows={3}
            />
          </label>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              defaultChecked={area.enabled}
              className="w-4 h-4"
            />
            <span className="font-semibold text-sm">Enabled</span>
          </label>

          {!area.enabled && (
            <label className="flex flex-col">
              <span className="font-semibold text-sm mb-1">Disabled until</span>
              <input
                type="datetime-local"
                defaultValue={
                  area.disabled_until
                    ? new Date(area.disabled_until).toISOString().slice(0, 16)
                    : ""
                }
                className="border rounded p-2"
              />
            </label>
          )}

          <div className="flex justify-between items-center mt-6">
            <Button
              type="button"
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => {
                deleteArea(area.uuid);
                navigate("/area");
              }}
            >
              Delete
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded-md"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                Save
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
