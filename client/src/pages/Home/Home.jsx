import React from "react";
import Banner from "../../components/Banner/Banner";
import TopApps from "../../components/TopApps/TopApps";
import AllApps from "../../components/AllApps/AllApps";
import PopularApps from "../../components/PopularApps/PopularApps";
import TwoApps from "../../components/TwoApps/TwoApps";
import PromoBanner from "../../components/PromoBanner/PromoBanner";
import SingleApp from "../../components/SingleApp/SingleApp";

const Home = () => {
  return (
    <>
      <Banner />
      <div className="max-w-7xl mx-auto space-y-6 px-2 mt-6 lg:px-0">
        <TopApps />
        <PopularApps />
        <AllApps />
        <PromoBanner />
        <TwoApps />
        <SingleApp />
        <PromoBanner />
      </div>
    </>
  );
};

export default Home;
