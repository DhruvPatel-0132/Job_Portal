import { useState, useEffect } from "react";
import { useProfileStore } from "../store/profileStore";
import { useAuthStore } from "../store/authStore";
import Navbar from "../components/Navbar";

import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutCard from "../components/Profile/AboutCard";
import ExperienceCard from "../components/Profile/ExperienceCard";
import EducationCard from "../components/Profile/EducationCard";
import SkillsCard from "../components/Profile/SkillsCard";

import EditProfileModal from "../components/Profile/EditProfileModal";

export default function Profile() {
  const { profile, fetchProfile, updateProfile, isLoading } = useProfileStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // EDIT MODAL STATE
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [activeSection, setActiveSection] = useState("basic");
  // Helper to format dates for input fields
  const formatDateForInput = (date, type = "date") => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const iso = d.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
    return type === "month" ? iso.slice(0, 7) : iso.slice(0, 10);
  };

  // When opening the edit modal, populate editData from the current profile
  const handleOpenEditModal = (sectionId = "basic") => {
    setActiveSection(sectionId);
    setEditData({
      firstName: profile?.fullName?.split(" ")[0] || user?.firstName || "",
      lastName: profile?.fullName?.split(" ").slice(1).join(" ") || user?.lastName || "",
      avatar: profile?.avatar || "",
      banner: profile?.banner || "",
      headline: profile?.headline || "",
      about: profile?.about || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      country: profile?.country || "",
      city: profile?.city || "",
      address: profile?.address || "",
      postalCode: profile?.postalCode || "",
      birthday: formatDateForInput(profile?.birthday),
      skills: profile?.skills || [],
      experience: (profile?.experience || []).map(exp => ({
        ...exp,
        startDate: formatDateForInput(exp.startDate, "month"),
        endDate: formatDateForInput(exp.endDate, "month"),
      })),
      education: (profile?.education || []).map(edu => ({
        ...edu,
        startDate: formatDateForInput(edu.startDate),
        endDate: formatDateForInput(edu.endDate),
      })),
    });
    setIsEditOpen(true);
  };

  const handleSaveProfile = async (updatedData) => {
    const payload = {
      ...updatedData,
      fullName: `${updatedData.firstName || ""} ${updatedData.lastName || ""}`.trim(),
    };
    await updateProfile(payload);
    fetchProfile();
  };

  if (isLoading && !profile) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Profile not found</div>;
  }

  // Sort experience and education by date (newest first)
  const sortedExperience = [...(profile?.experience || [])].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
    const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
    return dateB - dateA;
  });

  const sortedEducation = [...(profile?.education || [])].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate) : new Date(0);
    const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
    return dateB - dateA;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center px-5 pt-5 py-5">
        <div className="w-full max-w-3xl space-y-4">
          <ProfileHeader profile={profile} onEdit={() => handleOpenEditModal("basic")} />

          <AboutCard
            about={profile?.about}
            onEdit={() => handleOpenEditModal("about")}
          />

          <ExperienceCard experience={sortedExperience} onEdit={() => handleOpenEditModal("professional")} />
          <EducationCard education={sortedEducation} onEdit={() => handleOpenEditModal("education")} />
          <SkillsCard skills={profile?.skills} onEdit={() => handleOpenEditModal("skills")} />
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditProfileModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSaveProfile}
        initialSection={activeSection}
      />

    </>
  );
}
