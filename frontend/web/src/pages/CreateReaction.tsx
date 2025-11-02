import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import type { Reaction, Service } from "../types";
import ServiceTable from "../components/Create/ServiceTable";
import HookTable from "../components/Create/HookTable";
import { useArea } from "../context/AreaContext";
import { Button } from "../components/Button";
import Icon from "../components/icons/icons";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import DynamicReactionForm from "../components/DynamicHooksForm";

export default function CreateReaction() {
  const nav = useNavigate();

  const {
    services,
    selectedReactionService,
    setSelectedReactionService,
    selectedReaction,
    setSelectedReaction,
    resourceId,
    setResourceId,
    payload,
    setPayload,
  } = useArea();

  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setFilteredServices(services.filter((s) => s.reactions.length > 0));
  }, [services]);

  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    setFilteredServices(
      services.filter(
        (s) => s.reactions.length > 0 && s.name.toLowerCase().includes(q)
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServiceSelection = (service: Service) => {
    setSelectedReactionService(service);
  };

  const handleHookSelection = (hook: Reaction) => {
    if (resourceId || payload) {
      setIsOpen(true);
    }
    setSelectedReaction(hook);
  };

  useEffect(() => {
    if (selectedReaction && !resourceId && !payload) {
      setIsOpen(true);
    }
  }, [selectedReaction]);

  const handleReturn = () => {
    if (!selectedReactionService && !selectedReaction) {
      nav("/create");
    } else {
      setSelectedReaction(null);
      setSelectedReactionService(null);
      setResourceId({});
      setPayload("");
    }
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setSelectedReaction(null);
    setResourceId({});
    setPayload("");
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col p-8 pb-0 bg-accent transition-all duration-500 ease-in-out`}
    >
      <Button
        type="button"
        onClick={handleReturn}
        className="absolute top-8 left-8 w-fit bg-black"
      >
        <Icon iconName="return" iconClass="text-white w-6 h-6"></Icon>
      </Button>

      <div className="text-center mb-8 transition-all duration-500 ease-in-out">
        <h1
          className={`${
            !isSearching ? "text-4xl" : "text-6xl transform translate-y-10"
          } font-bold text-gray-800 mb-2 transition-all duration-500 ease-in-out`}
        >
          Choose your response
        </h1>
        <p
          className={`text-gray-600 transition-all duration-500 ease-in-out ${
            !isSearching ? "text-lg" : "text-2xl transform translate-y-10"
          }`}
        >
          Select a service to create an automation.
        </p>
      </div>

      <div
        ref={searchBarRef}
        className={`w-full flex justify-center mb-6 transition-all duration-500 ease-in-out ${
          isSearching ? "translate-y-20" : ""
        }`}
      >
        <SearchBar
          placeholder="Search a service (e.g. Discord)"
          onSearch={handleSearch}
          className={`transition-all duration-500 ease-in-out ${
            !isSearching ? "max-w-3xl h-14" : "max-w-xl h-12"
          }`}
          onClick={() => setIsSearching(true)}
        />
      </div>

      <div
        className={`flex flex-col items-center w-full transition-all duration-500 ease-in-out ${
          isSearching ? "mt-20" : "mt-0"
        }`}
      >
        {filteredServices.length === 0 ? (
          <p className="text-gray-500 text-lg mt-10">No available services</p>
        ) : selectedReactionService ? (
          <HookTable
            services={[selectedReactionService]}
            type="reaction"
            onSelect={handleHookSelection}
          />
        ) : (
          <ServiceTable
            services={filteredServices}
            onSelect={handleServiceSelection}
          />
        )}

        <Modal isOpen={isOpen} onClose={handleModalClose}>
          <DynamicReactionForm
            parameters={selectedReaction?.parameters || []}
            serviceName={selectedReactionService?.name || ""}
            requiredPayload={selectedReaction?.requires_payload}
            type="reaction"
            onClose={() => {
              setIsOpen(false);
              nav("/create");
            }}
          />
        </Modal>
      </div>
      <Footer />
    </div>
  );
}
