// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";
import { routes } from "./router/router.jsx";

import AuthProvider from "./AuthContext/AuthContext.jsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Global Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="backdrop-blur-md border border-blue-900/30 rounded-xl shadow-lg"
          bodyClassName="text-white font-medium"
        />

        {/* App Router */}
        <RouterProvider router={routes} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
