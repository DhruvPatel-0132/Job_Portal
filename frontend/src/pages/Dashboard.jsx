import React, { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import SidebarProfile from "../components/Dashboard/SidebarProfile";
import SidebarCompanyProfile from "../components/Dashboard/SidebarCompanyProfile";
import Feed from "../components/Dashboard/Feed";
import JobRecommendations from "../components/Dashboard/JobRecommendations";
import ProfileProgress from "../components/Dashboard/ProfileProgress";
import CompanyProgress from "../components/CompanyProfile/CompanyProgress";
import { useAuthStore } from "../store/authStore";
import SidebarContent from "../components/Dashboard/SidebarContent";

const Dashboard = () => {
  const { user, profile, company, token } = useAuthStore();
  const [isProgressHidden, setIsProgressHidden] = useState(() => {
    return localStorage.getItem("progressBarHidden") === "true";
  });

  const handleHideProgress = () => {
    setIsProgressHidden(true);
    localStorage.setItem("progressBarHidden", "true");
  };

  const handleShowProgress = () => {
    setIsProgressHidden(false);
    localStorage.setItem("progressBarHidden", "false");
  };

  // Show loading while user data is being fetched on refresh
  if (token && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content Area */}
      <main className="max-w-[1080px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="w-full lg:w-[225px] flex-shrink-0 self-start lg:sticky lg:top-[72px] flex flex-col gap-4">
            <SidebarContent />
            <AnimatePresence mode="wait">
              {isProgressHidden && (
                user?.role === "company" ? (
                  <CompanyProgress key="company-sidebar" company={company} profile={profile} isSidebar={true} onShow={handleShowProgress} />
                ) : (
                  <ProfileProgress key="profile-sidebar" profile={profile} isSidebar={true} onShow={handleShowProgress} />
                )
              )}
            </AnimatePresence>
          </div>
          <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 self-start">
            <AnimatePresence mode="wait">
              {!isProgressHidden && (
                user?.role === "company" ? (
                  <CompanyProgress key="company-main" company={company} profile={profile} onHide={handleHideProgress} />
                ) : (
                  <ProfileProgress key="profile-main" profile={profile} onHide={handleHideProgress} />
                )
              )}
            </AnimatePresence>
            <Feed />
          </div>

          <div className="w-full lg:w-[300px] flex-shrink-0 hidden lg:block">
            <JobRecommendations />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
