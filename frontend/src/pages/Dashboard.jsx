import React from "react";
import SidebarProfile from "../components/dashboard/SidebarProfile";
import Feed from "../components/dashboard/Feed";
import JobRecommendations from "../components/dashboard/JobRecommendations";

const Dashboard = () => {
  return (
    <>
      {/* Main Content Area */}
      <main className="max-w-[1080px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          {/* Left Sidebar — sticky below navbar, self-start so it doesn't stretch */}
          <div
            className="w-full lg:w-[225px] flex-shrink-0 self-start
                        lg:sticky lg:top-[72px]
                        transition-all duration-300 ease-in-out will-change-transform"
          >
            <SidebarProfile />
          </div>

          {/* Center Feed — self-start so it doesn't stretch to match right column */}
          <div className="w-full lg:w-[540px] xl:w-[600px] flex-shrink-0 self-start">
            <Feed />
          </div>

          {/* Right Sidebar — stretches to feed height (no self-start) so sticky footer works */}
          <div className="w-full lg:w-[300px] flex-shrink-0 hidden lg:block">
            {/* Job Recommendations — scrolls up with the page and disappears */}
            <div className="transition-all duration-300 ease-in-out">
              <JobRecommendations />
            </div>

            {/* Footer Links — sticky top: anchors itself once job recs scroll off screen */}
            <div className="sticky top-[72px] mt-4 px-2 py-2">
              <ul className="flex flex-wrap text-xs text-gray-500 gap-x-3 gap-y-1.5">
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-colors duration-150"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-colors duration-150"
                  >
                    Accessibility
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-colors duration-150"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-colors duration-150"
                  >
                    Privacy &amp; Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:underline transition-colors duration-150"
                  >
                    Ad Choices
                  </a>
                </li>
              </ul>
              <p className="mt-2 text-xs text-gray-400">Job Portal © 2026</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
