import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfileStore } from "../store/profileStore";
import { useAuthStore } from "../store/authStore";
import { useNetworkStore } from "../store/networkStore";
import { useMessageStore } from "../store/messageStore";

import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutCard from "../components/Profile/AboutCard";
import ExperienceCard from "../components/Profile/ExperienceCard";
import EducationCard from "../components/Profile/EducationCard";
import SkillsCard from "../components/Profile/SkillsCard";

import CompanyHeader from "../components/CompanyProfile/CompanyHeader";
import CompanyOverview from "../components/CompanyProfile/CompanyOverview";
import CompanyServices from "../components/CompanyProfile/CompanyServices";

/**
 * PublicProfile
 *
 * Displays another user's profile at /profile/:userId.
 * Behaviour:
 *   - If the `:userId` matches the logged-in user → redirect to /profile (own page)
 *   - If the target user has role "company" → render the company profile view (read-only)
 *   - Otherwise → render the standard user profile view (read-only, no edit buttons)
 *
 * Data is fetched via profileStore.fetchPublicProfile and stored in
 * publicProfile / publicRole / publicCompanyData — completely separate from
 * the logged-in user's own profile state.
 */
export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const {
    publicProfile,
    publicRole,
    publicCompanyData,
    publicConnectionStatus,
    publicIsFollowing,
    setPublicConnectionStatus,
    setPublicIsFollowing,
    isFetchingPublic,
    publicError,
    fetchPublicProfile,
    clearPublicProfile,
  } = useProfileStore();

  const { sendConnectionRequest, followCompany, unfollowCompany, removeConnection } = useNetworkStore();
  const { setActiveConversation } = useMessageStore();

  // If the viewer is looking at their own profile, redirect to the own-profile page.
  useEffect(() => {
    if (user && user._id === userId) {
      navigate("/profile", { replace: true });
    }
  }, [user, userId, navigate]);

  // Fetch on mount, clean up on unmount.
  useEffect(() => {
    window.scrollTo(0, 0);
    if (userId) {
      fetchPublicProfile(userId);
    }
    return () => {
      clearPublicProfile();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // ─── Loading state ───────────────────────────────────────────────────────────
  if (isFetchingPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  // ─── Error / not-found state ─────────────────────────────────────────────────
  if (publicError || (!isFetchingPublic && !publicProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-gray-800">Profile not found</p>
          <p className="text-sm text-gray-500">
            This profile may not exist or may have been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleConnect = async () => {
    await sendConnectionRequest(userId);
    setPublicConnectionStatus("pending_sent");
  };

  const handleRemoveConnection = async () => {
    await removeConnection(userId);
    setPublicConnectionStatus("none");
  };

  const handleMessage = () => {
    // Format the user object expected by messageStore
    const chatUser = {
      _id: userId,
      fullName: publicProfile?.fullName || "",
      avatar: publicProfile?.avatar || "",
      headline: publicProfile?.headline || "",
    };
    setActiveConversation(chatUser);
    // Navigating back to dashboard (where the messaging popup typically lives)
    // or we just stay on the page and the global chat window will open.
    // Assuming global chat window opens via state `isChatOpen`
  };

  const handleToggleFollow = async () => {
    if (!publicCompanyData) return;
    if (publicIsFollowing) {
      await unfollowCompany(publicCompanyData._id);
      setPublicIsFollowing(false);
    } else {
      await followCompany(publicCompanyData._id);
      setPublicIsFollowing(true);
    }
  };

  // ─── Company profile view ────────────────────────────────────────────────────
  if (publicRole === "company" && publicCompanyData) {
    const companyInfo = {
      tagline: publicCompanyData.tagline || publicProfile?.headline || "",
      website: publicCompanyData.website || "",
      phone: publicCompanyData.phone || "",
      industry: publicCompanyData.industry || "",
      companySize: publicCompanyData.companySize || "",
      location: publicCompanyData.location || "",
      headquarters:
        publicCompanyData.headquarters ||
        (publicProfile?.city
          ? `${publicProfile.city}, ${publicProfile.country}`
          : ""),
      foundedYear:
        publicCompanyData.foundedYear || publicCompanyData.establishedYear || "",
      type: publicCompanyData.type || "",
      followersCount: publicCompanyData.followersCount || 0,
      specialties: publicCompanyData.specialties || [],
      services: publicCompanyData.services || [],
    };

    return (
      <div className="min-h-screen bg-gray-50 flex justify-center px-5 pt-5 py-5">
        <div className="w-full max-w-3xl space-y-6">
          {/* onEdit is omitted → CompanyHeader hides edit button automatically */}
          <CompanyHeader
            company={publicCompanyData}
            companyInfo={companyInfo}
            profile={publicProfile}
            isFollowing={publicIsFollowing}
            onToggleFollow={handleToggleFollow}
          />
          <CompanyOverview
            company={publicCompanyData}
            companyInfo={companyInfo}
            profile={publicProfile}
          />
          <CompanyServices services={companyInfo.services} />
        </div>
      </div>
    );
  }

  // ─── User profile view (default) ─────────────────────────────────────────────
  const sortedExperience = [...(publicProfile?.experience || [])].sort(
    (a, b) =>
      new Date(b.startDate || 0) - new Date(a.startDate || 0)
  );

  const sortedEducation = [...(publicProfile?.education || [])].sort(
    (a, b) =>
      new Date(b.startDate || 0) - new Date(a.startDate || 0)
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-5 pt-5 py-5">
      <div className="w-full max-w-3xl space-y-4">
        {/* isViewOnly hides the edit button */}
        <ProfileHeader 
          profile={publicProfile} 
          isViewOnly 
          connectionStatus={publicConnectionStatus}
          onConnect={handleConnect}
          onMessage={handleMessage}
          onRemoveConnection={handleRemoveConnection}
        />

        <AboutCard about={publicProfile?.about} />

        <ExperienceCard experience={sortedExperience} />
        <EducationCard education={sortedEducation} />
        <SkillsCard skills={publicProfile?.skills} />
      </div>
    </div>
  );
}
