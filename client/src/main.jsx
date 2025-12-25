import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Route, RouterProvider } from "react-router";
import { routes } from "./router/router.jsx";
import AuthProvider from "./AuthContext/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={routes} />
    </AuthProvider>
  </StrictMode>
);
