import React from "react";
import Banner from "../../components/Banner/Banner";
import TopApps from "../../components/TopApps/TopApps";
import AllApps from "../../components/AllApps/AllApps";
import PopularApps from "../../components/PopularApps/PopularApps";
import SingleApp from "../../components/MostDownloadPromotion/MostDownloadPromotion";
import AdsPromotionOne from "../../components/AdsPromotionOne/AdsPromotionOne";
import AdsPromotionTwo from "../../components/AdsPromotionTwo/AdsPromotionTwo";
import BadgeApp from "../../components/BadgeApp/BadgeApp";
import MostDownloadPromotion from "../../components/MostDownloadPromotion/MostDownloadPromotion";

const Home = () => {
  return (
    <>
      <Banner />
      <div className="max-w-7xl mx-auto space-y-6 px-2 mt-6 lg:px-0">
        <TopApps />
        <PopularApps />
        <AllApps />
        <AdsPromotionOne />
        <BadgeApp />
        <MostDownloadPromotion />
        <AdsPromotionTwo />
      </div>
    </>
  );
};

export default Home;
