import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../api/axios";
import FullApplication from "../components/JobApplication/FullApplication";

const JobApplication = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/posts/${jobId}`);
        if (res.data.success && res.data.post) {
          const apiJob = res.data.post;
          const refJob = apiJob.referenceId || {};
          
          const formattedJob = {
            id: apiJob._id,
            title: refJob.title || "Job Post",
            company: apiJob.author?.name || (apiJob.author?.firstName ? `${apiJob.author.firstName} ${apiJob.author.lastName}` : "Company"),
            location: refJob.location || "Remote",
            salary: refJob.salary && !refJob.salary.hideSalary ? refJob.salary : "Not Disclosed",
            type: refJob.employmentType ? refJob.employmentType.replace("_", "-") : "Full-time",
            workMode: refJob.workMode || "Remote",
            experience: refJob.experienceLevel || "Not Specified",
            logo: apiJob.author?.logo || apiJob.author?.avatar || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg",
            description: refJob.description || apiJob.content,
            skills: refJob.skillsRequired || [],
            benefits: refJob.benefits && refJob.benefits.length > 0 ? refJob.benefits : [
              "Health Insurance",
              "Flexible Hours",
              "Remote Work",
            ],
            deadline: refJob.applicationDeadline 
              ? new Date(refJob.applicationDeadline).toLocaleDateString() 
              : "Ongoing",
          };
          setJob(formattedJob);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="w-10 h-10 border-3 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return <Navigate to="/jobs" replace />;
  }

  return <FullApplication job={job} />;
};

export default JobApplication;
