import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes.tsx";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import  {AuthProvider} from './app/login/AuthProvider.tsx';

const queryClient = new QueryClient ();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CssBaseline />
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
);
