import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import AllApk from "../pages/AllApk/AllApk";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Login from "../pages/Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Revenue from "../pages/Revenue/Revenue";
import Notifications from "../pages/Notifications/Notifications";
import Wallets from "../pages/Wallets/Wallets";
import Likes from "../pages/Likes/Likes";
import Analytics from "../pages/Analytics/Analytics";
import AllDeveloper from "../pages/AllDeveloper/AllDeveloper";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            {" "}
            <Home></Home>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "all-apk",
        element: (
          <PrivateRoute>
            {" "}
            <AllApk></AllApk>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "all-developer",
        element: (
          <PrivateRoute>
            <AllDeveloper></AllDeveloper>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "revenue",
        element: (
          <PrivateRoute>
            <Revenue></Revenue>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <PrivateRoute>
            <Notifications></Notifications>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "analytics",
        element: (
          <PrivateRoute>
            <Analytics></Analytics>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "likes",
        element: (
          <PrivateRoute>
            <Likes></Likes>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "wallets",
        element: (
          <PrivateRoute>
            <Wallets></Wallets>{" "}
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <Login></Login>,
  },
]);
