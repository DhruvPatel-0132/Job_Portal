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
import EditAbout from "../components/Profile/EditAbout";

export default function Profile() {
  const { profile, fetchProfile, updateProfile, isLoading } = useProfileStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // EDIT MODAL STATE
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  // EDIT ABOUT STATE
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [editAboutText, setEditAboutText] = useState("");

  // Helper to format dates for input fields
  const formatDateForInput = (date, type = "date") => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const iso = d.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
    return type === "month" ? iso.slice(0, 7) : iso.slice(0, 10);
  };

  // When opening the edit modal, populate editData from the current profile
  const handleOpenEditModal = () => {
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
      code: profile?.code || "",
      address: profile?.address || "",
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

  const handleOpenAboutModal = () => {
    setEditAboutText(profile?.about || "");
    setIsEditAboutOpen(true);
  };

  const handleSaveProfile = async (updatedData) => {
    const payload = {
      ...updatedData,
      fullName: `${updatedData.firstName || ""} ${updatedData.lastName || ""}`.trim(),
    };
    await updateProfile(payload);
    fetchProfile();
  };

  const handleSaveAbout = async (newAboutText) => {
    await updateProfile({ about: newAboutText });
    fetchProfile();
    setIsEditAboutOpen(false);
  };

  if (isLoading && !profile) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Profile not found</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center px-4 pt-5">
        <div className="w-full max-w-3xl space-y-4">
          <ProfileHeader profile={profile} onEdit={handleOpenEditModal} />

          <AboutCard
            about={profile?.about}
            onEdit={handleOpenAboutModal}
          />

          <ExperienceCard experience={profile?.experience} onEdit={handleOpenEditModal} />
          <EducationCard education={profile?.education} onEdit={handleOpenEditModal} />
          <SkillsCard skills={profile?.skills} onEdit={handleOpenEditModal} />
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditProfileModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSaveProfile}
      />

      {/* EDIT ABOUT */}
      <EditAbout
        isOpen={isEditAboutOpen}
        setIsOpen={setIsEditAboutOpen}
        aboutText={editAboutText}
        setAboutText={setEditAboutText}
        onSave={handleSaveAbout}
      />
    </>
  );
}
