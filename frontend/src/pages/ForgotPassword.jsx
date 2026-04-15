import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function ForgotPassword() {
  const [method, setMethod] = useState("email");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [timer, setTimer] = useState(30);

  /* Timer */
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Reset via Email or Phone
          </p>
        </div>

        {/* Tabs */}
        <div className="relative flex bg-gray-100 rounded-lg p-1 mb-6">
          <motion.div
            layout
            className="absolute top-1 bottom-1 w-1/2 bg-white rounded-md shadow"
            style={{ left: method === "email" ? "0%" : "50%" }}
          />

          <button
            onClick={() => {
              setMethod("email");
              setStep(1);
            }}
            className="flex-1 py-2 text-sm font-medium z-10"
          >
            Email Link
          </button>

          <button
            onClick={() => {
              setMethod("phone");
              setStep(1);
            }}
            className="flex-1 py-2 text-sm font-medium z-10"
          >
            Phone OTP
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={method + step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <>
                {method === "email" ? (
                  <Input
                    label="Email Address"
                    placeholder="Enter your email"
                  />
                ) : (
                  <PhoneInput />
                )}

                <PrimaryButton
                  text={method === "email" ? "Send Reset Link" : "Send OTP"}
                  onClick={() => setStep(method === "email" ? 3 : 2)}
                />
              </>
            )}

            {/* STEP 2 - OTP */}
            {step === 2 && method === "phone" && (
              <>
                <div>
                  <label className="text-sm text-gray-700 font-medium">
                    Enter OTP
                  </label>

                  <div
                    className="flex justify-between mt-2"
                    onPaste={handlePaste}
                  >
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) =>
                          handleChange(e.target.value, index)
                        }
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 text-center text-lg rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between mt-3 text-xs text-gray-500">
                    <span>
                      {timer > 0
                        ? `Resend in ${timer}s`
                        : "Didn't receive code?"}
                    </span>

                    {timer === 0 && (
                      <button
                        onClick={() => setTimer(30)}
                        className="text-gray-900 font-medium"
                      >
                        Resend
                      </button>
                    )}
                  </div>
                </div>

                <PrimaryButton
                  text="Verify OTP"
                  onClick={() => setStep(3)}
                />
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                {method === "email" ? (
                  <div className="text-center">
                    <div className="text-green-600 text-lg font-medium mb-2">
                      ✔ Link Sent
                    </div>
                    <p className="text-sm text-gray-500">
                      Check your email to reset password
                    </p>
                  </div>
                ) : (
                  <>
                    <Input
                      label="New Password"
                      placeholder="Enter new password"
                      type="password"
                    />

                    <Input
                      label="Confirm Password"
                      placeholder="Confirm password"
                      type="password"
                    />

                    <PrimaryButton text="Reset Password" />
                  </>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Back */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Remember your password?{" "}
          <NavLink
            to="/"
            className="font-medium text-gray-900 hover:underline"
          >
            Sign In
          </NavLink>
        </p>
      </motion.div>
    </div>
  );
}

/* Components */

function Input({ label, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-gray-900 outline-none"
      />
    </div>
  );
}

function PhoneInput() {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">
        Phone Number
      </label>
      <div className="flex gap-2 mt-1">
        <span className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm">
          +91
        </span>
        <input
          type="text"
          placeholder="Enter number"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-gray-900 outline-none"
        />
      </div>
    </div>
  );
}

function PrimaryButton({ text, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className="w-full py-2.5 rounded-lg bg-gray-900 text-white text-sm font-medium"
    >
      {text}
    </motion.button>
  );
}
