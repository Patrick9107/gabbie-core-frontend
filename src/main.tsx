import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes.tsx";
import { CssBaseline } from "@mui/material";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <CssBaseline />
        <AppRoutes />
    </StrictMode>
);
