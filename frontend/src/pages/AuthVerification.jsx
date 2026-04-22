import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const [method, setMethod] = useState("email");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
const [form, setForm] = useState({
  email: "",
  phone: "",
  countryCode: "+91",
});

  /* Timer */
  useEffect(() => {
    if (!isTimerActive || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const handleSendOtp = async () => {
  try {
    const url =
      method === "email"
        ? "http://localhost:5000/api/otp/email/send-email-otp"
        : "http://localhost:5000/api/otp/phone/send";

    const body =
      method === "email"
        ? { email: form.email }
        : { countryCode: form.countryCode, mobile: form.phone };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setTimer(30);
    setIsTimerActive(true);
  } catch (err) {
    console.log(err);
  }
};

  const handleVerify = async () => {
  const otpValue = otp.join("");

  const url =
    method === "email"
      ? "http://localhost:5000/api/otp/email/verify-email-otp"
      : "http://localhost:5000/api/otp/phone/verify";

  const body =
    method === "email"
      ? { email: form.email, otp: otpValue }
      : {
          countryCode: form.countryCode,
          mobile: form.phone,
          otp: otpValue,
        };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.href = "/dashboard";
  } else {
    alert(data.message);
  }
};

const handleResend = async () => {
  try {
    const url =
      method === "email"
        ? "http://localhost:5000/api/otp/email/send-email-otp"
        : "http://localhost:5000/api/otp/phone/send";

    const body =
      method === "email"
        ? { email: form.email }
        : { mobile: form.phone };

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // restart timer
    setTimer(30);
    setIsTimerActive(true);

    // clear OTP fields
    setOtp(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  } catch (err) {
    console.log(err);
  }
};
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

  const contentVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
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
          <p className="text-sm text-gray-500 mt-1">
            Enter the OTP to continue
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
            onClick={() => setMethod("email")}
            className="flex-1 py-2 text-sm font-medium z-10"
          >
            Email OTP
          </button>

          <button
            onClick={() => setMethod("phone")}
            className="flex-1 py-2 text-sm font-medium z-10"
          >
            Phone OTP
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={method}
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-5"
          >
            {/* Input */}
            {method === "email" ? (
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            ) : (
              <PhoneInput form={form} setForm={setForm} />
            )}

            {/* Send OTP */}
            <PrimaryButton text="Send OTP" onClick={handleSendOtp} />

            {/* OTP BOXES */}
            <div>
              <label className="text-sm text-gray-700 font-medium">
                Enter OTP
              </label>

              <div className="flex justify-between mt-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-lg rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none"
                  />
                ))}
              </div>

              {/* Resend */}
              <div className="flex justify-between mt-3 text-xs text-gray-500">
                <span>
                  {timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}
                </span>

                {timer === 0 && isTimerActive && (
                  <button
                    onClick={handleResend}
                    disabled={!form.email || timer > 0}
                    className="text-gray-900 font-medium cursor-pointer"
                  >
                    Resend
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Verify */}
        <motion.button
          onClick={handleVerify}
          disabled={!isComplete}
          whileTap={{ scale: isComplete ? 0.97 : 1 }}
          className={`w-full mt-6 py-3 rounded-lg font-medium transition ${
            isComplete
              ? "bg-gray-900 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Verify
        </motion.button>
      </motion.div>
    </div>
  );
}

/* Components */

function Input({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-gray-900 outline-none"
      />
    </div>
  );
}

function PhoneInput({ form, setForm }) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium">
        Phone Number
      </label>

      <div className="flex gap-2 mt-1">
        <span className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm">
          {form.countryCode}
        </span>

        <input
          type="text"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
          placeholder="Enter number"
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300"
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
