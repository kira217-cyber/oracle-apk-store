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
import AddCategory from "../pages/AddCategory/AddCategory";
import BannerPromotion from "../pages/BannerPromotion/BannerPromotion";
import PopularPromotion from "../pages/PopularPromotion/PopularPromotion";
import AdsPromotionTwoController from "../pages/AdsPromotionTwoController/AdsPromotionTwoController";
import AdsPromotionOneController from "../pages/AdsPromotionOneController/AdsPromotionOneController";
import BadgeAppController from "../pages/BadgeAppController/BadgeAppController";
import MostDownloadPromotionController from "../pages/MostDownloadPromotionController/MostDownloadPromotionController";

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
        path: "add-category",
        element: (
          <PrivateRoute>
            <AddCategory></AddCategory>{" "}
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
      {
        path: "promotions/banner",
        element: (
          <PrivateRoute>
            <BannerPromotion></BannerPromotion>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "promotions/popular",
        element: (
          <PrivateRoute>
            <PopularPromotion></PopularPromotion>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "promotions/ads-one",
        element: (
          <PrivateRoute>
            <AdsPromotionOneController></AdsPromotionOneController>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "promotions/ads-two",
        element: (
          <PrivateRoute>
            <AdsPromotionTwoController></AdsPromotionTwoController>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "promotions/badge-app",
        element: (
          <PrivateRoute>
            <BadgeAppController></BadgeAppController>{" "}
          </PrivateRoute>
        ),
      },
      {
        path: "promotions/most-download",
        element: (
          <PrivateRoute>
            <MostDownloadPromotionController></MostDownloadPromotionController>{" "}
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
