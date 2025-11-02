import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./router.tsx";
import { AreaProvider } from "./context/AreaContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AreaProvider>
      <AppRouter />
    </AreaProvider>
  </StrictMode>
);
