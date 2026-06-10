import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AuthVerification from "./pages/AuthVerification";
import Register from "./components/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import CompanyProfile from "./pages/CompanyProfile";
import PublicProfile from "./pages/PublicProfile";
import Jobs from "./pages/Jobs";
import Onboarding from "./pages/Onboarding";
import MainLayout from "./components/MainLayout";
import ManagePosts from "./pages/ManagePosts";
import SavedPosts from "./pages/SavedPosts";
import MyJobPosts from "./pages/hiring/MyJobPosts";
import Applications from "./pages/hiring/Applications";
import Candidates from "./pages/hiring/Candidates";
import AIListing from "./pages/hiring/AIListing";

/* ✅ USE ZUSTAND */
import { useAuthStore } from "./store/authStore";
import useSocketStore from "./store/socketStore";
import NotificationPage from "./pages/NotificationPage";
import MyNetwork from "./pages/MyNetwork";
import { useEffect } from "react";
import SettingsPrivacy from "./pages/SettingsPrivacy";

/* 🔥 PRIVATE ROUTE (ZUSTAND) */
function PrivateRoute({ children }) {
  const token = useAuthStore((state) => state.token);

  // fallback (page refresh)
  const finalToken = token || localStorage.getItem("token");

  return finalToken ? children : <Navigate to="/" replace />;
}

// Wrapper for Profile Route to check role
function ProfileRouteWrapper() {
  const user = useAuthStore((state) => state.user);
  return user?.role === "company" ? <CompanyProfile /> : <Profile />;
}

// Wrapper for Network Route to hide for company
function NetworkRouteWrapper() {
  const user = useAuthStore((state) => state.user);
  if (user?.role === "company") {
    return <Navigate to="/dashboard" replace />;
  }
  return <MyNetwork />;
}

// Wrapper for Hiring Routes to restrict to company users only
function HiringRouteWrapper({ children }) {
  const user = useAuthStore((state) => state.user);
  if (user?.role !== "company") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  const { fetchUser, token } = useAuthStore();
  const { connectSocket } = useSocketStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const activeToken = storedToken || token;
    
    if (activeToken) {
      fetchUser();
      connectSocket(activeToken);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<AuthVerification />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfileRouteWrapper />} />
        <Route path="/profile/:userId" element={<PublicProfile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/network" element={<NetworkRouteWrapper />} />
        <Route path="/manage-posts" element={<ManagePosts />} />
        <Route path="/saved-posts" element={<SavedPosts />} />
        <Route path="/settings-privacy" element={<SettingsPrivacy />} />
        <Route path="/hiring/job-posts" element={<HiringRouteWrapper><MyJobPosts /></HiringRouteWrapper>} />
        <Route path="/hiring/applications" element={<HiringRouteWrapper><Applications /></HiringRouteWrapper>} />
        <Route path="/hiring/candidates" element={<HiringRouteWrapper><Candidates /></HiringRouteWrapper>} />
        <Route path="/hiring/ai-listing" element={<HiringRouteWrapper><AIListing /></HiringRouteWrapper>} />
      </Route>
    </Routes>
  );
}
