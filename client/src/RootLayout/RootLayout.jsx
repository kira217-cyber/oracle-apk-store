import React from "react";
import Navbar from "../components/shared/Navbar/Navbar";
import Footer from "../components/shared/Footer/Footer";
import { Outlet } from "react-router";
import BottomNavbar from "../components/shared/BottomNavbar/BottomNavbar";
import FloatingSocial from "../components/FloatingSocial/FloatingSocial";

const RootLayout = () => {
  return (
    <div>
      <Navbar />

      <div className="pb-4">
        <Outlet />
      </div>
      <BottomNavbar />
      <Footer />
      <FloatingSocial />
    </div>
  );
};

export default RootLayout;
