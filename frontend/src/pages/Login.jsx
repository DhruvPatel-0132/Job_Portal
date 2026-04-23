import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // remove error while typing
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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        emailOrPhone: form.identifier,
        password: form.password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      const data = res.data;

      // 🚨 HANDLE OTP FIRST
      if (data.requireOTP) {
        localStorage.setItem("userId", data.userId);
        navigate("/auth");
        return;
      }

      // ✅ store tokens ONLY if login success
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // normal flow
      if (!data.isVerified) {
        navigate("/auth");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err.message);

      setErrors({
        identifier: err.response?.data?.message || "Login failed",
      });
    }
  };

  const handleGoogleLogin = () => {
    navigate("/google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }} 
        className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
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
            to="forgot-password"
            className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            Forgot password?
          </NavLink>
        </div>

        {/* Login Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition"
        >
          Sign In
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

        {/* Google */}
        <GoogleLogin
          onSuccess={async (res) => {
            const response = await axios.post(
              "http://localhost:5000/api/auth/google",
              {
                token: res.credential,
              },
            );

            const data = response.data;

            localStorage.setItem("token", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            navigate("/dashboard");
          }}
        />
      </motion.div>
    </div>
  );
}
