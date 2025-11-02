import type { Service } from "../../types";

interface HookTableProps {
  services: Service[];
  type: "action" | "reaction";
  onSelect: (hook: any) => void;
}

export default function HookTable({
  services,
  type,
  onSelect,
}: HookTableProps) {
  const getHooks = (service: Service) =>
    type === "action" ? service.actions : service.reactions;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl mt-6">
      {services.map((service) => {
        const hooks = getHooks(service);

        if (!hooks || hooks.length === 0) return null;

        return hooks.map((hook) => (
          <div
            key={hook.uuid}
            onClick={() => onSelect(hook)}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-6 flex flex-col items-center gap-4 cursor-pointer border border-gray-100 hover:outline-2 hover:outline-black"
          >
            {/* Service Logo + Name */}
            <div className="flex items-center gap-4 w-full">
              <img
                src={`data:image/png;base64,${service.icon}`}
                alt={service.name}
                className="w-12 h-12 object-contain rounded-full"
              />
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">
                  {hook.name}
                </h2>
                <p className="text-sm text-gray-500">{service.name}</p>
              </div>
            </div>

            {/* Hook Description */}
            <p className="text-gray-600 text-sm line-clamp-3">
              {hook.description || "No description provided."}
            </p>

            {/* Type Badge */}
            <span
              className={`self-end text-xs font-semibold uppercase px-2 py-1 rounded-full ${
                type === "action"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {type}
            </span>
          </div>
        ));
      })}
    </div>
  );
}
