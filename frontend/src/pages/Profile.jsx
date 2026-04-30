import { useState } from "react";
import Navbar from "../components/Navbar";

import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutCard from "../components/Profile/AboutCard";
import ExperienceCard from "../components/Profile/ExperienceCard";
import EducationCard from "../components/Profile/EducationCard";
import SkillsCard from "../components/Profile/SkillsCard";

import EditProfileModal from "../components/Profile/EditProfileModal";
import EditAbout from "../components/Profile/EditAbout";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "Dhruv Patel",
    headline: "Full Stack Developer | React | Node.js | Next.js",
    avatar: "https://i.pravatar.cc/150?img=12",
    banner: "https://images.unsplash.com/photo-1503264116251-35a269479413",
    country: "India",
    address: "Ahmedabad, Gujarat",
    about:
      "Full Stack Developer passionate about building scalable web applications using MERN stack and modern frameworks like Next.js.",

    skills: ["React", "Node.js", "Express", "MongoDB", "Next.js", "TypeScript"],

    experience: [
      {
        title: "Software Developer Intern",
        company: "Tech Company",
        employmentType: "Internship",
        location: "India",
        locationType: "Remote",
        startDate: "2025",
        endDate: "Present",
        currentlyWorking: true,
        description: "Built REST APIs and React dashboards.",
        skills: ["React", "Node.js", "MongoDB"],
      },
    ],

    education: [
      {
        school: "GTU University",
        degree: "B.Tech",
        fieldOfStudy: "Computer Engineering",
        startYear: 2022,
        endYear: 2026,
      },
    ],
  });

  // EDIT MODAL STATE
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editData, setEditData] = useState({
    firstName: "Dhruv",
    lastName: "Patel",
    avatar: profile.avatar,
    headline: profile.headline,
    country: profile.country,
    city: "Ahmedabad",
    postalCode: "380001",
    education: "B.Tech Computer Engineering",
    industry: "Software Development",
    email: "dhruv@example.com",
    phone: "+91 99999 99999",
    address: profile.address,
    birthday: "2002-01-01",
  });

  // EDIT ABOUT STATE
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [editAboutText, setEditAboutText] = useState(profile.about);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex justify-center px-4 pt-5">
        <div className="w-full max-w-3xl space-y-4">
          <ProfileHeader profile={profile} onEdit={() => setIsEditOpen(true)} />

          <AboutCard
            about={profile.about}
            onEdit={() => setIsEditAboutOpen(true)}
          />

          <ExperienceCard experience={profile.experience} />
          <EducationCard education={profile.education} />
          <SkillsCard skills={profile.skills} />
        </div>
      </div>

      {/* EDIT MODAL */}
      <EditProfileModal
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        editData={editData}
        setEditData={setEditData}
      />

      {/* EDIT ABOUT */}
      <EditAbout
        isOpen={isEditAboutOpen}
        setIsOpen={setIsEditAboutOpen}
        aboutText={editAboutText}
        setAboutText={setEditAboutText}
      />
    </>
  );
}
