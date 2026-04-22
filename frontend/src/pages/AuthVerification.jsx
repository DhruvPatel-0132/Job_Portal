/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

export default function Auth() {
  const handleRedirect = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Verification</h2>
          <p className="text-sm text-gray-500 mt-1">Static demo page</p>
        </div>

        {/* Tabs (UI only) */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <div className="flex-1 py-2 text-sm font-medium text-center bg-white rounded-md shadow">
            Email OTP
          </div>
          <div className="flex-1 py-2 text-sm font-medium text-center text-gray-500">
            Phone OTP
          </div>
        </div>

        {/* Static Input UI */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Email Address
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50"
              disabled
            />
          </div>

          <button className="w-full py-2.5 rounded-lg bg-gray-300 text-gray-600 text-sm font-medium cursor-not-allowed">
            Send OTP
          </button>

          {/* OTP Boxes (static only) */}
          <div>
            <label className="text-sm text-gray-700 font-medium">
              Enter OTP
            </label>

            <div className="flex justify-between mt-2">
              {Array(6)
                .fill("")
                .map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    disabled
                    className="w-12 h-12 text-center text-lg rounded-lg border border-gray-300 bg-gray-50"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Verify Button */}
        <motion.button
          onClick={handleRedirect}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6 py-3 rounded-lg font-medium bg-gray-900 text-white"
        >
          Go to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}
