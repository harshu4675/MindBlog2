import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import WelcomePopup from "../components/WelcomePopup/WelcomePopup";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <ProgressBar />
      <Navbar />
      <main className="main-content" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <WelcomePopup />
    </div>
  );
};

export default MainLayout;
