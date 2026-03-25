import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MsalProvider } from "@azure/msal-react";
import "./app/i18n/i18n.ts";
import './index.css';
import App from "./App.tsx";
import { AuthProvider } from "./app/auth/auth.provider.tsx";
import { msalInstance } from "./app/auth/msalConfig.ts";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(

    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <MsalProvider instance={msalInstance}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </MsalProvider>
        </QueryClientProvider>
    </StrictMode>

);
