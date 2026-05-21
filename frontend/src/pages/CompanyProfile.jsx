import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import CompanyHeader from "../components/CompanyProfile/CompanyHeader";
import CompanyOverview from "../components/CompanyProfile/CompanyOverview";
import CompanyServices from "../components/CompanyProfile/CompanyServices";
import EditCompanyModal from "../components/CompanyProfile/EditCompanyModal";
import { Edit3 } from "lucide-react";

export default function CompanyProfile() {
  const { user, company, updateCompany } = useAuthStore();
  const { profile, fetchProfile, isLoading } = useProfileStore();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeSection, setActiveSection] = useState("general");

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

  const safeCompany = company || {};

  // Resolved data — real DB values take priority, static demo data as fallback
  const companyInfo = {
    tagline: safeCompany.tagline || profile?.headline || "",
    website: safeCompany.website || "",
    phone: safeCompany.phone || "",
    industry: safeCompany.industry || "",
    companySize: safeCompany.companySize || "",
    location: safeCompany.location || "",
    headquarters:
      safeCompany.headquarters ||
      (profile?.city ? `${profile.city}, ${profile.country}` : ""),
    foundedYear: safeCompany.foundedYear || safeCompany.establishedYear || "",
    type: safeCompany.type || "",
    followersCount: safeCompany.followersCount || 0,
    specialties: safeCompany.specialties || [],
    services: safeCompany.services || [],
  };

  const handleOpenEditModal = (sectionId = "general") => {
    setActiveSection(sectionId);
    setEditData({ ...safeCompany });
    setIsEditModalOpen(true);
  };

  const handleSave = async (data) => {
    await updateCompany(data);
  };

  const isOwner = user?.role === "company"; // Assuming they are viewing their own company

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-5 pt-5 py-5 relative">
      <div className="w-full max-w-3xl space-y-6">
        <CompanyHeader
          company={safeCompany}
          companyInfo={companyInfo}
          user={user}
          profile={profile}
          onEdit={isOwner ? () => handleOpenEditModal("general") : undefined}
        />

        <CompanyOverview
          company={safeCompany}
          companyInfo={companyInfo}
          profile={profile}
          onEdit={isOwner ? () => handleOpenEditModal("about") : undefined}
        />

        <CompanyServices 
          services={companyInfo.services} 
          onEdit={isOwner ? () => handleOpenEditModal("services") : undefined} 
        />
      </div>

      <EditCompanyModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSave}
        initialSection={activeSection}
      />
    </div>
  );
}
