import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import AllApk from "../pages/AllApk/AllApk";
import Withdraw from "../pages/Wihtdraw/Withdraw";
import Profile from "../pages/Profile/Profile";
import TopUp from "../pages/TopUp/TopUp";
import BoostApp from "../pages/BoostApp/BoostApp";
import ReferLink from "../pages/ReferLink/ReferLink";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "all-apk",
        element: <AllApk></AllApk>,
      },
      {
        path: "withdraw",
        element: <Withdraw></Withdraw>,
      },
      {
        path: "top-up",
        element: <TopUp></TopUp>,
      },

      {
        path: "profile",
        element: <Profile></Profile>,
      },
      {
        path: "refer-link",
        element: <ReferLink></ReferLink>,
      },
      {
        path: "boost-app",
        element: <BoostApp></BoostApp>,
      },
    ],
  },
]);
