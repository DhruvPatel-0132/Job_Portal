import Footer from "../components/dashboard/Footer";
import { useNetworkStore } from "../store/networkStore";
import ConnectionRequestList from "../components/network/ConnectionRequestList";
import UserProfileCard from "../components/network/UserProfileCard";
import CompanyCard from "../components/network/CompanyCard";
import ConnectionsSection from "../components/network/ConnectionsSection";
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

  const suggestedPeople = networkUsers.filter((person) => {
    return (
      person.role !== "company" && !connections.some((c) => c._id === person._id)
    );
  });

  const suggestedCompanies = networkUsers.filter((person) => {
    return person.role === "company";
  });

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
            <ConnectionsSection connections={connections} />

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

              {/* Grid of cards */}
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading suggestions...
                </div>
              ) : suggestedPeople.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3">
                  {suggestedPeople.map((person) => {
                    const isConnected = false; // We filtered them out
                    const isPending = requests.outgoing.some(
                      (r) =>
                        r.recipientId === person._id ||
                        r.recipientId?._id === person._id,
                    );

                    return (
                      <UserProfileCard
                        key={person._id}
                        person={person}
                        isConnected={isConnected}
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

            {/* Companies Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3">
                <h2 className="text-[16px] font-medium text-gray-600">
                  Companies you should follow
                </h2>
                <button className="text-[16px] font-bold text-gray-500 hover:text-black hover:underline transition-colors">
                  Show all
                </button>
              </div>

              {/* Grid of cards */}
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
                      <CompanyCard
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
