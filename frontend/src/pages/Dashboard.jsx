import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SidebarProfile from "../components/dashboard/SidebarProfile";
import SidebarCompanyProfile from "../components/dashboard/SidebarCompanyProfile";
import Feed from "../components/dashboard/Feed";
import JobRecommendations from "../components/dashboard/JobRecommendations";
import ProfileProgress from "../components/dashboard/ProfileProgress";
import CompanyProgress from "../components/CompanyProfile/CompanyProgress";
import { useAuthStore } from "../store/authStore";
import SidebarContent from "../components/dashboard/SidebarContent";

const Dashboard = () => {
  const { user, profile, company, token } = useAuthStore();

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
          <SidebarContent />
          <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 self-start">
            {user?.role === "company" ? (
              <CompanyProgress company={company} profile={profile} />
            ) : (
              <ProfileProgress profile={profile} />
            )}
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
