import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = () => {
    console.log(form);
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to continue
          </p>
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
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 
            focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 
            outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 
            focus:bg-white focus:border-gray-900 focus:ring-1 focus:ring-gray-900 
            outline-none transition"
          />
        </div>

        {/* Forgot */}
        <div className="text-right mb-6">
          <span className="text-sm text-gray-500 hover:text-gray-900 cursor-pointer transition">
            Forgot password?
          </span>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium 
          hover:bg-black transition active:scale-[0.995]"
        >
          Sign In
        </button>

        {/* Register (NavLink) */}
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

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg 
          border border-gray-300 bg-white hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-sm font-medium text-gray-700">
            Continue with Google
          </span>
        </button>

      </div>
    </div>
  );
}