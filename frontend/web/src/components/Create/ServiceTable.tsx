import type { Service } from "../../types";
import { getLogo } from "../../utils/getLogo";

interface ServiceTableProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

export default function ServiceTable({
  services,
  onSelect,
}: ServiceTableProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl mt-6">
      {services.map((service) => (
        <div
          key={service.uuid}
          onClick={() => onSelect(service)}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 p-6 flex flex-col items-center gap-4 cursor-pointer border border-gray-100 hover:outline-2 hover:outline-black"
        >
          <img
            src={getLogo(service.name.toLowerCase())}
            alt={service.name}
            className="w-20 h-20 object-contain rounded-full"
          />
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {service.name}
          </h2>
        </div>
      ))}
    </div>
  );
}
