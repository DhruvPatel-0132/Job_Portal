import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return setMessage("Fill all fields");
    }

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/forgot/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      setMessage(data.msg);

      if (res.ok) {
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch {
      setMessage("Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <p className="text-center mt-10">Invalid or missing token</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        <h2 className="text-xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {message && (
          <p className="text-sm text-center mb-4 text-gray-600">
            {message}
          </p>
        )}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <button
          onClick={handleReset}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </motion.div>
    </div>
  );
}