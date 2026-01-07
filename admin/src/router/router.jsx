import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import Withdraw from "../pages/Wihtdraw/Withdraw";
import Profile from "../pages/Profile/Profile";
import TopUp from "../pages/TopUp/TopUp";
import BoostApp from "../pages/BoostApp/BoostApp";
import ReferLink from "../pages/ReferLink/ReferLink";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import UploadApk from "../pages/UploadApk/UploadApk";
import MyApp from "../pages/MyApp/MyApp";

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
        path: "my-apps",
        element: (
          <PrivateRoute>
            <MyApp></MyApp>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "withdraw",
        element: (
          <PrivateRoute>
            {" "}
            <Withdraw></Withdraw>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "top-up",
        element: (
          <PrivateRoute>
            {" "}
            <TopUp></TopUp>{" "}
          </PrivateRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <PrivateRoute>
            {" "}
            <Profile></Profile>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "refer-link",
        element: (
          <PrivateRoute>
            <ReferLink></ReferLink>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "boost-app",
        element: (
          <PrivateRoute>
            {" "}
            <BoostApp></BoostApp>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "upload-apk",
        element: (
          <PrivateRoute>
            {" "}
            <UploadApk></UploadApk>{" "}
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "register",
    element: <Register></Register>,
  },
  {
    path: "login",
    element: <Login></Login>,
  },
]);
