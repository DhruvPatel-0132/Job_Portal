import React, { useEffect } from "react";
import { X, UserPlus, CheckCircle2 } from "lucide-react";
import SidebarProfile from "../components/dashboard/SidebarProfile";
import Footer from "../components/dashboard/Footer";
import { useProfileStore } from "../store/profileStore";

// Static dummy data for connection requests
const connectionRequestsData = [
  {
    id: 1,
    name: "Alex Johnson",
    headline: "Frontend Developer at TechNova",
    avatar: "/avatar.svg",
    time: "1d",
  },
  {
    id: 2,
    name: "Sarah Williams",
    headline: "UX Designer at Creative Solutions",
    avatar: "/avatar.svg",
    time: "2d",
  },
];

// Static dummy data for "People you may know"
const peopleYouMayKnowData = [
  {
    id: 1,
    name: "Dev Dekate",
    headline: "Student at navgujarat college of computer science...",
    avatar: "/avatar.svg",
    mutualConnectionsCount: 5,
    mutualName: "Nirav",
    banner: "linear-gradient(to bottom right, #a1c4fd, #c2e9fb)",
    isVerified: true,
  },
  {
    id: 2,
    name: "Tarun Khunt",
    headline: "Student at Gujarat University",
    avatar: "/avatar.svg",
    mutualConnectionsCount: 7,
    mutualName: "Chauhan",
    banner: "linear-gradient(to bottom right, #cfd9df, #e2ebf0)",
    isVerified: false,
  },
  {
    id: 3,
    name: "Hemal Mistry",
    headline: "Aspiring UI/UX Designer | Python & AI/ML Developer",
    avatar: "/avatar.svg",
    mutualConnectionsCount: 3,
    mutualName: "Rutvi",
    banner: "linear-gradient(to bottom right, #fff1eb, #ace0f9)",
    isVerified: true,
  },
  {
    id: 4,
    name: "Dr.Dhaval Patel",
    headline: "Associate Professor at L.J.Institute of Computer Applications",
    avatar: "/avatar.svg",
    mutualConnectionsCount: 1,
    mutualName: "Piyush",
    banner: "linear-gradient(to bottom right, #e6e9f0, #eef1f5)",
    isVerified: false,
  },
  {
    id: 5,
    name: "Priya Sharma",
    headline: "HR Manager at TechSol | Talent Acquisition",
    avatar: "/avatar.svg",
    mutualConnectionsCount: 12,
    mutualName: "Amit",
    banner: "linear-gradient(to bottom right, #f6d365, #fda085)",
    isVerified: true,
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    headline: "Full Stack Developer | Open Source Contributor",
    avatar: "/avatar.svg",
    mutualConnectionsCount: 15,
    mutualName: "Sanjay",
    banner: "linear-gradient(to bottom right, #84fab0, #8fd3f4)",
    isVerified: false,
  },
];

const ConnectionRequestList = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-[16px] font-bold text-gray-900">Invitations</h2>
        <button className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
          Manage
        </button>
      </div>
      <div className="flex flex-col">
        {connectionRequestsData.map((request) => (
          <div
            key={request.id}
            className="p-4 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
          >
            <img
              src={request.avatar}
              alt={request.name}
              className="w-14 h-14 rounded-full border border-gray-100 shadow-sm object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate hover:text-blue-600 hover:underline cursor-pointer">
                {request.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">
                {request.headline}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                <UserPlus className="w-3 h-3" />
                {request.time} ago
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                title="Ignore"
              >
                <X className="w-5 h-5" />
              </button>
              <button className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 text-sm font-bold hover:bg-blue-50 transition-all">
                Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PeopleYouMayKnowCard = ({ person }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col items-center text-center relative group hover:shadow-md transition-shadow duration-300">
      {/* Banner */}
      <div
        className="h-14 w-full opacity-40"
        style={{ background: person.banner }}
      />

      {/* Close button */}
      <button className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10">
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Avatar */}
      <div className="relative -mt-9 mb-2">
        <img
          src={person.avatar}
          alt={person.name}
          className="w-18 h-18 rounded-full border-2 border-white shadow-sm object-cover bg-white"
        />
      </div>

      {/* Content */}
      <div className="px-3 pb-4 flex-1 flex flex-col w-full">
        <div className="flex items-center justify-center gap-1">
          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 hover:text-blue-600 hover:underline cursor-pointer">
            {person.name}
          </h3>
          {person.isVerified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
        <p className="text-[12px] text-gray-500 line-clamp-2 mt-0.5 min-h-[36px] leading-tight px-2">
          {person.headline}
        </p>

        {/* Mutual Connections */}
        <div className="mt-auto pt-3 pb-4">
          <div className="flex items-center justify-center gap-1.5 text-gray-500">
            <img
              src={person.avatar}
              className="w-4 h-4 rounded-full border border-white flex-shrink-0"
              alt=""
            />
            <span className="text-[10px] font-medium line-clamp-1">
              {person.mutualName} and {person.mutualConnectionsCount} other
              mutual connections
            </span>
          </div>
        </div>

        {/* Connect Button */}
        <button className="w-[90%] mx-auto py-1.5 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 hover:border-blue-700 transition-all flex items-center justify-center gap-1 group">
          <UserPlus className="w-4 h-4" />
          Connect
        </button>
      </div>
    </div>
  );
};

const MyNetwork = () => {
  const { profile, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, [profile, fetchProfile]);

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[225px] flex-shrink-0 space-y-4">
            <div className="self-start lg:sticky lg:top-[72px]">
              <SidebarProfile profile={profile} />
              <Footer />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ConnectionRequestList />

            {/* People You May Know Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3">
                <h2 className="text-[16px] font-medium text-gray-600">
                  People you may know in Greater Ahmedabad Area
                </h2>
                <button className="text-[16px] font-bold text-gray-500 hover:text-blue-600 transition-colors">
                  Show all
                </button>
              </div>

              {/* Grid of cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3">
                {peopleYouMayKnowData.map((person) => (
                  <PeopleYouMayKnowCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyNetwork;
