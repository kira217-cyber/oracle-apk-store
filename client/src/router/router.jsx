import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AndroidApp from "../pages/AndroidApp/AndroidApp";
import IsoApp from "../pages/IsoApp/IsoApp";
import WindowsSoft from "../pages/WindowsSoft/WindowsSoft";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "android", element: <AndroidApp /> },
      { path: "iso", element: <IsoApp /> },
      { path: "windows", element: <WindowsSoft /> },
    ],
  },
]);
