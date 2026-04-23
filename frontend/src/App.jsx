import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthVerification from "./pages/AuthVerification";
import Register from "./components/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import MainLayout from "./components/MainLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
            {/* 🔥 ADD THIS */}
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/auth" element={<AuthVerification />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}