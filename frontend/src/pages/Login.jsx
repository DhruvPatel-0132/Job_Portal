import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";

import api from "../api/axios"; // ⚠️ fix path if needed
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const loginStore = useAuthStore((state) => state.login);

  useEffect(() => {
    if (token && user) {
      if (!user.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    }
  }, [token, user, navigate]);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Hibernation States
  const [showHibernateModal, setShowHibernateModal] = useState(false);
  const [showReactivateOtp, setShowReactivateOtp] = useState(false);
  const [reactivateData, setReactivateData] = useState({ userId: "", email: "" });
  const [reactivateOtp, setReactivateOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.identifier.trim()) {
      newErrors.identifier = "Email or phone is required";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        emailOrPhone: form.identifier,
        password: form.password,
      });

      const data = res.data;

      /* 🚨 HIBERNATION FLOW */
      if (data.isHibernated) {
        setReactivateData({ userId: data.userId, email: data.emailOrPhone });
        setShowHibernateModal(true);
        return;
      }

      /* 🚨 OTP FLOW */
      if (data.requireOTP) {
        localStorage.setItem("userId", data.userId);
        navigate("/auth");
        return;
      }

      /* ✅ LOGIN (ZUSTAND) */
      await loginStore(data);

      /* 🚨 VERIFY FLOW */
      if (!data.isVerified) {
        navigate("/auth");
      } else if (!data.user?.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setErrors({
        identifier: err.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Reactivation Logic ---
  const handleRequestReactivate = async () => {
    try {
      setLoading(true);
      await api.post("/auth/reactivate-request", { userId: reactivateData.userId });
      toast.success("OTP sent to your email");
      setShowHibernateModal(false);
      setShowReactivateOtp(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyReactivate = async () => {
    if (!reactivateOtp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/reactivate-verify", {
        userId: reactivateData.userId,
        otp: reactivateOtp
      });
      
      toast.success("Account reactivated successfully!");
      setShowReactivateOtp(false);
      
      // Log user in
      await loginStore(res.data);
      if (!res.data.user?.isOnboarded) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8 z-10"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        {/* Identifier */}
        <div className="mb-5">
          <label className="text-sm font-medium text-gray-700">
            Email / Phone
          </label>
          <input
            type="text"
            name="identifier"
            value={form.identifier}
            onChange={handleChange}
            placeholder="Enter your details"
            className={`w-full mt-1 px-4 py-2.5 rounded-lg border ${
              errors.identifier ? "border-red-500" : "border-gray-300"
            } bg-gray-50 focus:bg-white focus:ring-1 focus:ring-gray-900 outline-none`}
          />
          {errors.identifier && (
            <p className="text-red-500 text-xs mt-1">{errors.identifier}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className={`w-full mt-1 px-4 py-2.5 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } bg-gray-50 focus:bg-white focus:ring-1 focus:ring-gray-900 outline-none`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot */}
        <div className="text-right mb-6">
          <NavLink
            to="/forgot-password"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Forgot password?
          </NavLink>
        </div>

        {/* Login Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </motion.button>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <NavLink
            to="/register"
            className="font-medium text-gray-900 hover:underline"
          >
            Register
          </NavLink>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <GoogleLogin
          onSuccess={async (res) => {
            try {
              setLoading(true);

              const response = await api.post("/auth/google", {
                token: res.credential,
              });

              if (response.data.isHibernated) {
                setReactivateData({ userId: response.data.userId, email: response.data.emailOrPhone });
                setShowHibernateModal(true);
                return;
              }

              await loginStore(response.data);

              const { isNewUser, user: googleUser } = response.data;

              if (isNewUser) {
                navigate("/register", { state: { googleMode: true } });
              } else if (!googleUser?.isOnboarded) {
                navigate("/onboarding");
              } else {
                navigate("/dashboard");
              }
            } catch (err) {
              console.log("Google login failed");
            } finally {
              setLoading(false);
            }
          }}
        />
      </motion.div>

      {/* Hibernation Modal */}
      <AnimatePresence>
        {showHibernateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex items-center gap-2 text-yellow-600">
                  <ShieldAlert size={20} />
                  <h3 className="font-bold text-gray-900">Account Hibernated</h3>
                </div>
                <button
                  onClick={() => setShowHibernateModal(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <p className="mb-4 text-sm font-medium text-gray-700">
                  Your account is currently hibernated.
                </p>
                <p className="mb-6 text-sm text-gray-600">
                  Would you like to reactivate it to restore your profile visibility, messages, and notifications?
                </p>
              </div>

              <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                <button
                  onClick={() => setShowHibernateModal(false)}
                  className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50"
                >
                  Keep Hibernated
                </button>
                <button
                  onClick={handleRequestReactivate}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Reactivate Account"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reactivate OTP Modal */}
      <AnimatePresence>
        {showReactivateOtp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                <div className="flex items-center gap-2 text-blue-600">
                  <KeyRound size={20} />
                  <h3 className="font-bold text-gray-900">Verify Reactivation</h3>
                </div>
                <button
                  onClick={() => setShowReactivateOtp(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <p className="mb-4 text-sm text-gray-600">
                  We've sent a 6-digit OTP to your email: <span className="font-medium text-gray-900">{reactivateData.email}</span>
                </p>
                
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-semibold text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={reactivateOtp}
                    onChange={(e) => setReactivateOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-center tracking-widest text-lg font-bold rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                <button
                  onClick={() => setShowReactivateOtp(false)}
                  className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyReactivate}
                  disabled={loading || reactivateOtp.length !== 6}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Reactivate"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
