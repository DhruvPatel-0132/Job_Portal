import SidebarCompanyProfile from "./SidebarCompanyProfile";
import SidebarProfile from "./SidebarProfile";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";
import { useNetworkStore } from "../../store/networkStore";

const SidebarContent = () => {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile); // 🔥 ADD
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const fetchNetworkingData = useNetworkStore((state) => state.fetchNetworkingData);

  useEffect(() => {
    fetchUser();
    fetchNetworkingData();
  }, [fetchUser, fetchNetworkingData]);
  return (
    <>
      {/* 🔥 PASS PROFILE INSTEAD OF USER */}
      {user?.role === "company" ? (
        <SidebarCompanyProfile profile={profile} />
      ) : (
        <SidebarProfile profile={profile} />
      )}
    </>
  );
};

export default SidebarContent;
