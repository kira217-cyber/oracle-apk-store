import React from "react";
import Navbar from "../components/shared/Navbar/Navbar";
import Footer from "../components/shared/Footer/Footer";
import { Outlet } from "react-router";
import BottomNavbar from "../components/shared/BottomNavbar/BottomNavbar";

const RootLayout = () => {
  return (
    <div>
      <Navbar />

      <div className="pb-4">
        <Outlet />
      </div>

      <BottomNavbar />
      <Footer />
    </div>
  );
};

export default RootLayout;
