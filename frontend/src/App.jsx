import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AuthVerification from "./pages/AuthVerification";
import Register from "./components/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import CompanyProfile from "./pages/CompanyProfile";
import Jobs from "./pages/Jobs";
import Onboarding from "./pages/Onboarding";
import MainLayout from "./components/MainLayout";

/* ✅ USE ZUSTAND */
import { useAuthStore } from "./store/authStore";
import NotificationPage from "./pages/NotificationPage";
import MyNetwork from "./pages/MyNetwork";

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

export default function App() {
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
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/network" element={<MyNetwork />} />
      </Route>
    </Routes>
  );
}
