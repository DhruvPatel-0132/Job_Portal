import React from "react";
import { Edit2 } from "lucide-react";

export default function CompanyHeader({ company, companyInfo, user, profile, onEdit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Banner */}
      <div className="h-48 bg-gray-200 relative">
        {(company.banner || profile?.banner) ? (
          <img
            src={company.banner || profile.banner}
            alt="Company Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-500" />
        )}
      </div>

      <div className="px-8 pb-8 relative">
        {/* Logo + Edit Button Row */}
        <div className="flex justify-between items-end -mt-16 mb-4">
          {/* Logo */}
          <div className="w-32 h-32 rounded-lg bg-white p-1 shadow-md border border-gray-200">
            <div className="w-full h-full bg-gray-50 flex items-center justify-center overflow-hidden rounded-md">
              {(company.logo || profile?.avatar) ? (
                <img
                  src={company.logo || profile.avatar}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl text-blue-500 font-bold">
                  {(company.name || user?.firstName || "C").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors z-10 mb-2"
              aria-label="Edit Header"
            >
              <Edit2 size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Name, Tagline, Meta */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {company.name || profile?.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Company Name"}
          </h1>
          <p className="text-[15px] text-gray-800 mt-1">{companyInfo.tagline}</p>
          <p className="text-[14px] text-gray-500 mt-1">
            {[
              companyInfo.industry,
              companyInfo.location || companyInfo.headquarters,
              companyInfo.companySize,
              companyInfo.followersCount ? `${companyInfo.followersCount} followers` : null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <a
              href={companyInfo.website}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full font-semibold transition-colors text-sm"
            >
              Visit website
            </a>
            <button className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors shadow-sm text-sm">
              Follow
            </button>
          </div>

          {/* View Jobs Link */}
          {/* <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-4">
            <a
              href={companyInfo.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              View all open jobs
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
}
