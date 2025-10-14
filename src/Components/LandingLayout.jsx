import React from "react";
import { Outlet } from "react-router-dom";
import LandingpageNavbar from "./LandingpageNavbar";


const LandingLayout = () => {
  return (
    <div>
     <LandingpageNavbar/>
      <Outlet /> {/* Renders the landing page routes */}
    </div>
  );
};

export default LandingLayout;
