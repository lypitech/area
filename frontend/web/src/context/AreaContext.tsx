// src/context/AreaContext.tsx
import { createContext, useContext, useState } from "react";
import type { Action, Reaction, Service } from "../types";

interface AreaContextType {
  // Current user
  userUuid: string;
  setUserUuid: (u: string) => void;
  // List of services
  services: Service[];
  setServices: (s: Service[]) => void;
  // Selected Action app
  selectedActionService: Service | null;
  setSelectedActionService: (s: Service | null) => void;
  // Selected Reaction app
  selectedReactionService: Service | null;
  setSelectedReactionService: (s: Service | null) => void;
  // Selected trigger
  selectedAction: Action | null;
  setSelectedAction: (a: Action | null) => void;
  // Selected response
  selectedReaction: Reaction | null;
  setSelectedReaction: (r: Reaction | null) => void;
  // AreaSaving additional fields
  input: any;
  setInput: (i: any) => void;
  ressourceId: string;
  setRessourceId: (r: string) => void;
  payload: string;
  setPayload: (p: string) => void;
}

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export function AreaProvider({ children }: { children: React.ReactNode }) {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null
  );
  const [selectedActionService, setSelectedActionService] =
    useState<Service | null>(null);
  const [selectedReactionService, setSelectedReactionService] =
    useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  const [userUuid, setUserUuid] = useState("");

  const [input, setInput] = useState<any>("");

  const [ressourceId, setRessourceId] = useState("");
  const [payload, setPayload] = useState("");

  return (
    <AreaContext.Provider
      value={{
        userUuid,
        setUserUuid,
        services,
        setServices,
        selectedActionService,
        setSelectedActionService,
        selectedReactionService,
        setSelectedReactionService,
        selectedAction,
        setSelectedAction,
        selectedReaction,
        setSelectedReaction,
        input,
        setInput,
        ressourceId,
        setRessourceId,
        payload,
        setPayload,
      }}
    >
      {children}
    </AreaContext.Provider>
  );
}

export const useArea = () => {
  const context = useContext(AreaContext);
  if (!context) throw new Error("useArea must be used within AreaProvider");
  return context;
};
