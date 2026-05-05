import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import SidebarProfile from "../components/dashboard/SidebarProfile";
import SidebarCompanyProfile from "../components/dashboard/SidebarCompanyProfile";
import Feed from "../components/dashboard/Feed";
import JobRecommendations from "../components/dashboard/JobRecommendations";
import ProfileProgress from "../components/dashboard/ProfileProgress";
import { useAuthStore } from "../store/authStore";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile); // 🔥 ADD
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // console.log("🔥 DASHBOARD USER:", user);
  // console.log("🔥 DASHBOARD PROFILE:", profile); // 🔥 DEBUG

  return (
    <>
      {/* Main Content Area */}
      <main className="max-w-[1080px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <div className="w-full lg:w-[225px] flex-shrink-0 self-start lg:sticky lg:top-[72px]">
            {/* 🔥 PASS PROFILE INSTEAD OF USER */}
            {user?.role === "company" ? (
              <SidebarCompanyProfile profile={profile} />
            ) : (
              <SidebarProfile profile={profile} />
            )}
          </div>

          <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 self-start">
            <ProfileProgress profile={profile} />
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
