import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AndroidApp from "../pages/AndroidApp/AndroidApp";
import IsoApp from "../pages/IsoApp/IsoApp";
import WindowsSoft from "../pages/WindowsSoft/WindowsSoft";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Profile from "../pages/Profile/Profile";
import Search from "../pages/Search/Search";
import Download from "../pages/Download/Download";
import MyApps from "../pages/MyApps/MyApps";
import AppDetails from "../pages/AppDetails/AppDetails";
import PrivateRoute from "../PrivetRoute/PrivetRoute";

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
      {
        path: "iso",
        element: (
          <PrivateRoute>
            {" "}
            <IsoApp />
          </PrivateRoute>
        ),
      },
      { path: "windows", element: <WindowsSoft /> },
      { path: "search", element: <Search /> },
      { path: "download", element: <Download /> },
      { path: "profile", element: <Profile /> },
      { path: "my-apps", element: <MyApps /> },
      {
        path: "app-details/:id",
        element: <AppDetails />,
      },
    ],
  },
]);
