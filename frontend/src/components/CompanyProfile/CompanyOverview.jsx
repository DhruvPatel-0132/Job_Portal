import React from "react";
import { Edit2 } from "lucide-react";

const DetailItem = ({ label, children }) => (
  <div>
    <div className="text-gray-500 font-medium mb-1">{label}</div>
    {children}
  </div>
);

export default function CompanyOverview({ company, companyInfo, profile, onEdit }) {
  const about = company.about || profile?.about || "";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 relative">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Edit Overview"
        >
          <Edit2 size={20} className="text-gray-600" />
        </button>
      )}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>

      {/* About Text */}
      <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
        {about || <span className="text-gray-500 italic">No description added yet.</span>}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 text-[14px]">
        {companyInfo.website && (
          <DetailItem label="Website">
            <a
              href={companyInfo.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              {companyInfo.website.replace(/^https?:\/\//, "")}
            </a>
          </DetailItem>
        )}

        {companyInfo.phone && (
          <DetailItem label="Phone">
            <div className="text-gray-900">{companyInfo.phone}</div>
          </DetailItem>
        )}

        {companyInfo.industry && (
          <DetailItem label="Industry">
            <div className="text-gray-900">{companyInfo.industry}</div>
          </DetailItem>
        )}

        {companyInfo.companySize && (
          <DetailItem label="Company size">
            <div className="text-gray-900">{companyInfo.companySize}</div>
          </DetailItem>
        )}

        {companyInfo.location && (
          <DetailItem label="Location">
            <div className="text-gray-900">{companyInfo.location}</div>
          </DetailItem>
        )}

        {companyInfo.headquarters && (
          <DetailItem label="Headquarters">
            <div className="text-gray-900">{companyInfo.headquarters}</div>
          </DetailItem>
        )}

        {companyInfo.type && (
          <DetailItem label="Type">
            <div className="text-gray-900">{companyInfo.type}</div>
          </DetailItem>
        )}

        {companyInfo.foundedYear && (
          <DetailItem label="Founded">
            <div className="text-gray-900">{companyInfo.foundedYear}</div>
          </DetailItem>
        )}

        {companyInfo.specialties.length > 0 && (
          <div className="col-span-1 md:col-span-2 mt-2">
            <div className="text-gray-500 font-medium mb-2">Specialties</div>
            <div className="text-gray-900">{companyInfo.specialties.join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
}
