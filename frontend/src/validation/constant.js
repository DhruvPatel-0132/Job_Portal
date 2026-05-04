import {
  User,
  LibraryBig,
  FileChartColumn,
  Briefcase,
  GraduationCap,
  Mail,
  MapPin
} from "lucide-react";
import BasicSection from "../components/Profile/BasicSection";
import AboutSection from "../components/Profile/AboutSection";
import SkillsSection from "../components/Profile/SkillsSection";
import ProfessionalSection from "../components/Profile/ProfessionalSection";
import EducationSection from "../components/Profile/EducationSection";
import ContactSection from "../components/Profile/ContactSection";
import LocationSection from "../components/Profile/LocationSection";

export const SECTIONS = [
  { id: "basic", label: "General", icon: User, desc: "Personal information" },
  {
    id: "about",
    label: "About",
    icon: LibraryBig,
    desc: "Describe yourself and your achievements",
  },
  {
    id: "skills",
    label: "Skills",
    icon: FileChartColumn,
    desc: "Address your skills",
  },
  {
    id: "professional",
    label: "Experience",
    icon: Briefcase,
    desc: "Professional Career",
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    desc: "Educational Background",
  },
  { id: "contact", label: "Contact", icon: Mail, desc: "How to reach you" },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    desc: "Your address details",
  },
];

export const SECTION_MAP = {
  basic: BasicSection,
  about: AboutSection,
  skills: SkillsSection,
  professional: ProfessionalSection,
  education: EducationSection,
  contact: ContactSection,
  location: LocationSection,
};
