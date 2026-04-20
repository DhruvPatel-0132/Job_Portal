import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AuthVerification from "./pages/AuthVerification";
import Register from "./components/Register/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth" element={<AuthVerification />} />
      <Route path="/dashboard" element={<Dashboard />} /> 
    </Routes>
  );
}