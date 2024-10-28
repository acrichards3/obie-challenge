import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./styles/globals.scss";
import "./assets/fonts/Inter.ttf";

const root = document.getElementById("root");

const queryClient = new QueryClient();

if (root === null) throw new Error("Root element not found");

createRoot(root).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
);
