import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import type { Action, Service } from "../types";
import ServiceTable from "../components/Create/ServiceTable";
import HookTable from "../components/Create/HookTable";
import { useArea } from "../context/AreaContext";
import { Button } from "../components/Button";
import Icon from "../components/icons/icons";
import Modal from "../components/Modal";
import { getForm } from "../utils/parser";
import { isOauthNeeded } from "../utils/isOauthNeeded";
import OAuthParser from "../services/OAuth/oauthParser";

export default function CreateAction() {
  const nav = useNavigate();

  const {
    services,
    selectedActionService,
    setSelectedActionService,
    selectedAction,
    setSelectedAction,
  } = useArea();

  // Filter services with actions only
  useEffect(() => {
    setFilteredServices(services.filter((s) => s.actions.length > 0));
  }, [services]);

  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Search bar filter handling
  const handleSearch = (query: string) => {
    const q = query.toLowerCase();
    setFilteredServices(
      services.filter(
        (s) => s.actions.length > 0 && s.name.toLowerCase().includes(q)
      )
    );
  };

  // Close search bar on click outside
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

  // Handle service selection (ex: Github)
  const handleServiceSelection = (service: Service) => {
    if (isOauthNeeded(service.name.toLowerCase())) {
      OAuthParser(service.name.toLowerCase());
      setSelectedActionService(service);
      return;
    }
    setSelectedActionService(service);
  };

  // Handle hook selection (ex: Push on repository)
  const handleHookSelection = (hook: Action) => {
    setSelectedAction(hook);
  };

  useEffect(() => {
    if (selectedAction) {
      setIsOpen(true);
    }
  }, [selectedAction]);

  // Handle return and reset values of selected hooks
  const handleReturn = () => {
    if (!selectedActionService && !selectedAction) {
      nav("/create");
    } else {
      setSelectedAction(null);
      setSelectedActionService(null);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsOpen(false);
    setSelectedAction(null);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col p-8 bg-accent transition-all duration-500 ease-in-out `}
    >
      <Button
        type="button"
        onClick={handleReturn}
        className="absolute top-8 left-8 w-fit bg-black hover:scale-105 transition-all duration-200 ease-in-out"
      >
        <Icon iconName="return" iconClass="text-white w-6 h-6"></Icon>
      </Button>
      <div
        className={`text-center mb-8 transition-all duration-500 ease-in-out`}
      >
        <h1
          className={`${
            !isSearching ? "text-4xl" : "text-6xl transform translate-y-10"
          } font-bold text-gray-800 mb-2 transition-all duration-500 ease-in-out`}
        >
          Choose your trigger
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
        ) : selectedActionService ? (
          <HookTable
            services={[selectedActionService]}
            type="action"
            onSelect={handleHookSelection}
          />
        ) : (
          <ServiceTable
            services={filteredServices}
            onSelect={handleServiceSelection}
          />
        )}

        <Modal isOpen={isOpen} onClose={handleModalClose}>
          {getForm(selectedActionService?.name.toLowerCase() || "", {
            onClose: () => {
              setIsOpen(false);
              nav("/create");
            },
          })}
        </Modal>
      </div>
    </div>
  );
}
