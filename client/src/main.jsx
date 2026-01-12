import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { routes } from "./router/router.jsx";
import AuthProvider from "./AuthContext/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {" "}
        <AuthProvider>
          <ToastContainer position="top-right" />
          <RouterProvider router={routes} />
        </AuthProvider>{" "}
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
