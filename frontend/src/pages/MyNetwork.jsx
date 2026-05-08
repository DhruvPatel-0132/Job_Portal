import { Send } from "lucide-react";
import Footer from "../components/dashboard/Footer";
import { useNetworkStore } from "../store/networkStore";
import ConnectionRequestList from "../components/network/ConnectionRequestList";
import UserSuggestionCard from "../components/network/UserSuggestionCard";
import CompanySuggestionCard from "../components/network/CompanySuggestionCard";
import SidebarContent from "../components/dashboard/SidebarContent";
import { useEffect } from "react";

const MyNetwork = () => {
  const {
    networkUsers,
    requests,
    connections,
    followedCompanies,
    isLoading,
    fetchNetworkingData,
    sendConnectionRequest,
    acceptRequest,
    rejectRequest,
    followCompany,
    unfollowCompany,
  } = useNetworkStore();

  useEffect(() => {
    fetchNetworkingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestedUsers = networkUsers.filter((person) => {
    return !connections.some((c) => c._id === person._id);
  });

  const suggestedPeople = suggestedUsers.filter((u) => u.role !== "company");
  const suggestedCompanies = suggestedUsers.filter((u) => 
    u.role === "company" && !followedCompanies.some(fc => fc?._id === u.companyId)
  );

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <main className="max-w-[1128px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[225px] flex-shrink-0 space-y-4">
            <div className="self-start lg:sticky lg:top-[72px]">
              <div className="mb-4 hidden lg:block">
                <SidebarContent />
              </div>
              <div className="hidden lg:block sticky top-[calc(72px+16px+240px)]">
                <Footer />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <ConnectionRequestList
              requests={requests.incoming}
              onAccept={acceptRequest}
              onReject={rejectRequest}
            />

            {/* Connections Section */}
            {connections.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
                <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                  <h2 className="text-[16px] font-bold text-gray-900">
                    Your Connections ({connections.length})
                  </h2>
                  <button className="text-[16px] font-bold text-gray-500 hover:text-black hover:underline transition-colors">
                    Show all
                  </button>
                </div>
                <div className="flex flex-col">
                  {connections.map((conn) => (
                    <div
                      key={conn._id}
                      className="p-4 flex items-center gap-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <img
                        src={conn.avatar || "/avatar.svg"}
                        alt={conn.name}
                        className="w-14 h-14 rounded-full border border-gray-100 shadow-sm object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer truncate">
                          {conn.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conn.headline || "No headline available"}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <button className="px-4 py-1.5 border text-white bg-blue-600 rounded-full text-sm font-bold transition-all flex items-center align-center gap-1">
                          <Send className="h-4 w-4" />
                          Message
                        </button>
                        <button
                          onClick={() =>
                            (window.location.href = `/profile/${conn._id}`)
                          }
                          className="px-4 py-1.5 border border-blue-600 text-blue-600 rounded-full text-sm font-bold hover:bg-blue-50 transition-all"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* People You May Know Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="flex justify-between items-center px-4 py-3">
                <h2 className="text-[16px] font-medium text-gray-600">
                  People you may know
                </h2>
                <button className="text-[16px] font-bold text-gray-500 hover:text-black hover:underline transition-colors">
                  Show all
                </button>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading suggestions...
                </div>
              ) : suggestedPeople.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3">
                  {suggestedPeople.map((person) => {
                    const isPending = requests.outgoing.some(
                      (r) =>
                        r.recipientId === person._id ||
                        r.recipientId?._id === person._id,
                    );

                    return (
                      <UserSuggestionCard
                        key={person._id}
                        person={person}
                        isConnected={false}
                        isPending={isPending}
                        onConnect={() => sendConnectionRequest(person._id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No new people suggestions for now.
                </div>
              )}
            </div>

            {/* Companies You Should Follow Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
              <div className="flex justify-between items-center px-4 py-3">
                <h2 className="text-[16px] font-medium text-gray-600">
                  Companies you should follow
                </h2>
                <button className="text-[16px] font-bold text-gray-500 hover:text-black hover:underline transition-colors">
                  Show all
                </button>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading suggestions...
                </div>
              ) : suggestedCompanies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3">
                  {suggestedCompanies.map((company) => {
                    const isFollowed = followedCompanies.some(
                      (c) => c._id === company.companyId,
                    );

                    return (
                      <CompanySuggestionCard
                        key={company._id}
                        company={company}
                        isFollowed={isFollowed}
                        onFollow={() => followCompany(company.companyId)}
                        onUnfollow={() => unfollowCompany(company.companyId)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No new company suggestions for now.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


export default MyNetwork;
