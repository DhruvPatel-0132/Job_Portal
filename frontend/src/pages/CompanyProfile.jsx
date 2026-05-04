import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutCard from "../components/Profile/AboutCard";

export default function CompanyProfile() {
  const { user } = useAuthStore();
  const { profile, fetchProfile, isLoading } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading company profile...
        </div>
      </div>
    );
  }

  // Create a static company profile if profile is missing fields
  const companyInfo = {
    website: "https://www.example.com",
    industry: "Information Technology",
    companySize: "50-200 employees",
    location: profile?.city ? `${profile.city}, ${profile.country}` : "San Francisco, CA",
    establishedYear: "2020",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-5 pt-5 py-5">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            {profile?.banner && (
              <img 
                src={profile.banner} 
                alt="Company Banner" 
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
            )}
          </div>
          
          <div className="px-8 pb-8 relative">
            <div className="flex justify-between items-end -mt-16 mb-4">
              <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg border border-gray-100">
                <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                  {profile?.avatar ? (
                    <img src={profile.avatar} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-gray-400 font-bold">
                      {user?.firstName?.charAt(0) || "C"}
                    </span>
                  )}
                </div>
              </div>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm">
                Follow Company
              </button>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Company Name"}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{profile?.headline || "Innovative tech solutions for the modern world"}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  <a href={companyInfo.website} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">{companyInfo.website.replace("https://", "")}</a>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {companyInfo.location}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  {companyInfo.industry}
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  {companyInfo.companySize}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            About Us
          </h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {profile?.about || `We are a forward-thinking ${companyInfo.industry} company established in ${companyInfo.establishedYear}. Our mission is to deliver high-quality solutions that empower businesses to achieve their goals.\n\nWith a team of dedicated professionals, we strive to innovate and create impact in the industry. Our core values include integrity, excellence, and continuous improvement.`}
          </div>
        </div>

        {/* Stats/Highlight Section */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">20+</div>
            <div className="text-sm font-medium text-gray-500">Open Jobs</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">{companyInfo.establishedYear}</div>
            <div className="text-sm font-medium text-gray-500">Founded</div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-blue-600 mb-1">Global</div>
            <div className="text-sm font-medium text-gray-500">Presence</div>
          </div>
        </div>

      </div>
    </div>
  );
}
