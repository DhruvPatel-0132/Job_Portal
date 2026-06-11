import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import FullApplication from "../components/JobApplication/FullApplication";

const JOBS_DATA = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$150k - $220k",
    type: "Full-time",
    workMode: "Hybrid",
    experience: "3-5 years",
    logo: "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
    description:
      "We are looking for an experienced Full Stack Developer to build scalable web applications. You will work across the entire stack, from frontend UI in React to backend services in Node.js and Python. Strong problem-solving skills and system design experience are required.",
    skills: ["react", "node", "javascript", "python", "api", "sql"],
    benefits: [
      "Health Insurance",
      "Flexible Hours",
      "Remote Work",
      "Stock Options",
      "Learning Budget",
    ],
    deadline: "July 15, 2026",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Meta",
    location: "Remote",
    salary: "$130k - $190k",
    type: "Contract",
    workMode: "Remote",
    experience: "3-5 years",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    description:
      "Join our core product team to design intuitive and engaging user experiences. You will collaborate closely with product managers and engineers to take features from concept to launch. A strong portfolio demonstrating UI/UX principles and interaction design is a must.",
    skills: ["figma", "ui", "ux", "design", "prototyping"],
    benefits: [
      "Health Insurance",
      "Unlimited PTO",
      "Home Office Setup",
      "Wellness Budget",
    ],
    deadline: "August 1, 2026",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "Amazon",
    location: "Seattle, WA",
    salary: "$140k - $210k",
    type: "Full-time",
    workMode: "Onsite",
    experience: "5+ years",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    description:
      "Seeking a Data Scientist to analyze complex datasets and build predictive models. You will help drive business decisions through data insights and machine learning algorithms. Experience with SQL, Python, and statistical modeling is required.",
    skills: ["python", "sql", "data analysis", "machine learning", "statistics"],
    benefits: [
      "Health Insurance",
      "Relocation Bonus",
      "Stock Options",
      "Gym Membership",
      "Free Lunch",
    ],
    deadline: "July 30, 2026",
  },
];

const JobApplication = () => {
  const location = useLocation();

  // Try to get job from navigation state, or fall back to URL param
  let job = location.state?.job;

  if (!job) {
    // Extract job ID from URL and find in static data
    const pathParts = window.location.pathname.split("/");
    const jobId = parseInt(pathParts[pathParts.length - 1]);
    job = JOBS_DATA.find((j) => j.id === jobId);
  }

  // Ensure job has all enhanced fields
  if (job && !job.benefits) {
    const enhanced = JOBS_DATA.find((j) => j.id === job.id);
    if (enhanced) {
      job = { ...job, ...enhanced };
    }
  }

  if (!job) {
    return <Navigate to="/jobs" replace />;
  }

  return <FullApplication job={job} />;
};

export default JobApplication;
