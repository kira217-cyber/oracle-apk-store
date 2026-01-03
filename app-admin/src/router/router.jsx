import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home/Home";
import AllApk from "../pages/AllApk/AllApk";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AllUser from "../pages/AllUser/AllUser";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <NotFoundPage />,
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
        path: "all-user",
        element: <AllUser></AllUser>,
      },
    ],
  },
]);
