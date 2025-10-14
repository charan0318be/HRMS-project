import React from "react";
import DashboardNavbar from "./DashboardNavbar";
import { Outlet } from "react-router-dom";
import { ProfileProvider } from "./ProfileContext";

const DashboardLayout = () => {
  return (
    <ProfileProvider>
       <DashboardNavbar/>
        <div className="flex-1 p-6 overflow-y-auto">
         
        </div>
   
    </ProfileProvider>
  );
};

export default DashboardLayout;
