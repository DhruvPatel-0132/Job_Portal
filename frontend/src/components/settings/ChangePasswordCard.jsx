import React, { useEffect, useState } from "react";
import {
    KeyRound,
    ChevronRight,
    ShieldCheck,
    Mail,
    Lock,
    ArrowLeft,
    X,
    Eye,
    EyeOff,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ChangePasswordCard = () => {
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [openVerifyDialog, setOpenVerifyDialog] = useState(false);

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    /* ================= PASSWORD STRENGTH ================= */

    const getPasswordStrength = (password) => {
        if (!password) return "";

        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(
            password
        );

        const isLong = password.length >= 8;

        const score = [
            hasUpper,
            hasLower,
            hasNumber,
            hasSpecial,
            isLong,
        ].filter(Boolean).length;

        if (score <= 2) return "Weak";
        if (score <= 4) return "Medium";
        return "Strong";
    };

    const passwordStrength =
        getPasswordStrength(newPassword);
        
    /* ================= VERIFY EMAIL DIALOG ================= */
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        let interval;

        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleContinueToOTP = async () => {
        setError("");
        setSuccessMsg("");
        try {
            const res = await api.post("/auth/validate-password", {
                currentPassword,
                newPassword,
                confirmPassword,
            });
            if (res.data.success) {
                setOpenPasswordDialog(false);
                setOpenVerifyDialog(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Validation failed");
        }
    };

    const handleSendOTP = async () => {
        setError("");
        setSuccessMsg("");
        try {
            const res = await api.post("/auth/send-otp");
            if (res.data.success) {
                setOtpSent(true);
                setTimer(300); // 5 mins
                setSuccessMsg("OTP sent successfully!");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleChangePassword = async () => {
        setError("");
        setSuccessMsg("");
        try {
            const res = await api.post("/auth/change-password", {
                newPassword,
                otp,
            });
            if (res.data.success) {
                setSuccessMsg(res.data.message);
                setTimeout(() => {
                    logout();
                    navigate("/");
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        }
    };
    return (
        <>
            {/* ================= CARD ================= */}

            <motion.button
                whileHover={{
                    y: -3,
                    scale: 1.01,
                }}
                whileTap={{
                    scale: 0.98,
                }}
                onClick={() =>
                    setOpenPasswordDialog(true)
                }
                className="group relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
            >
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50 opacity-0 transition duration-500 group-hover:opacity-100" />

                {/* Shine */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -left-24 top-0 h-full w-20 rotate-12 bg-white blur-2xl transition-all duration-1000 group-hover:left-[130%]" />
                </div>

                <div className="relative flex items-start justify-between">
                    <motion.div
                        whileHover={{
                            rotate: 6,
                            scale: 1.04,
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm"
                    >
                        <KeyRound size={22} />
                    </motion.div>
                </div>

                <div className="relative mt-5">
                    <h3 className="text-xl font-bold text-gray-900">
                        Change Password
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        Update your password and keep your
                        account secure.
                    </p>
                </div>

                <motion.div
                    whileHover={{ x: 4 }}
                    className="relative mt-6 flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                    Manage Security
                    <ChevronRight size={16} />
                </motion.div>
            </motion.button>

            {/* ================= PASSWORD DIALOG ================= */}

            <AnimatePresence>
                {openPasswordDialog && (
                    <DialogWrapper>
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-[410px] overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-2xl"
                        >
                            {/* Header */}
                            <div className="border-b border-gray-100 bg-white px-5 py-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-700">
                                            <ShieldCheck
                                                size={20}
                                            />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Change Password
                                            </h2>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Keep your
                                                account protected
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setOpenPasswordDialog(
                                                false
                                            )
                                        }
                                        className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5">
                                <div className="space-y-4">
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
                                    <InputField
                                        icon={
                                            <Lock size={18} />
                                        }
                                        type={
                                            showCurrent
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Current Password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        eye
                                        show={showCurrent}
                                        toggle={() =>
                                            setShowCurrent(
                                                !showCurrent
                                            )
                                        }
                                    />

                                    <InputField
                                        icon={
                                            <KeyRound
                                                size={18}
                                            />
                                        }
                                        type={
                                            showNew
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="New Password"
                                        value={
                                            newPassword
                                        }
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        eye
                                        show={showNew}
                                        toggle={() =>
                                            setShowNew(
                                                !showNew
                                            )
                                        }
                                    />

                                    <InputField
                                        icon={
                                            <KeyRound
                                                size={18}
                                            />
                                        }
                                        type={
                                            showConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        eye
                                        show={showConfirm}
                                        toggle={() =>
                                            setShowConfirm(
                                                !showConfirm
                                            )
                                        }
                                    />
                                </div>

                                {/* ================= PASSWORD STRENGTH ================= */}

                                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-600">
                                            Password
                                            Strength
                                        </span>

                                        <span
                                            className={`text-xs font-semibold ${passwordStrength ===
                                                "Weak"
                                                ? "text-red-500"
                                                : passwordStrength ===
                                                    "Medium"
                                                    ? "text-yellow-500"
                                                    : passwordStrength ===
                                                        "Strong"
                                                        ? "text-green-600"
                                                        : "text-gray-400"
                                                }`}
                                        >
                                            {passwordStrength ||
                                                "Enter Password"}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                        <motion.div
                                            initial={{
                                                width: 0,
                                            }}
                                            animate={{
                                                width:
                                                    passwordStrength ===
                                                        "Weak"
                                                        ? "33%"
                                                        : passwordStrength ===
                                                            "Medium"
                                                            ? "66%"
                                                            : passwordStrength ===
                                                                "Strong"
                                                                ? "100%"
                                                                : "0%",
                                            }}
                                            transition={{
                                                duration: 0.3,
                                            }}
                                            className={`h-full rounded-full ${passwordStrength ===
                                                "Weak"
                                                ? "bg-red-500"
                                                : passwordStrength ===
                                                    "Medium"
                                                    ? "bg-yellow-400"
                                                    : passwordStrength ===
                                                        "Strong"
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                        />
                                    </div>

                                    {/* Rules */}
                                    <div className="mt-3 space-y-1 text-[11px] text-gray-500">
                                        <p>
                                            • Minimum 8
                                            characters
                                        </p>
                                        <p>
                                            • Uppercase &
                                            lowercase
                                            letters
                                        </p>
                                        <p>
                                            • Include
                                            number &
                                            special
                                            character
                                        </p>
                                    </div>
                                </div>

                                {/* Continue Button */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.01,
                                    }}
                                    whileTap={{
                                        scale: 0.98,
                                    }}
                                    onClick={handleContinueToOTP}
                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                >
                                    <Mail size={17} />
                                    Continue
                                </motion.button>
                            </div>
                        </motion.div>
                    </DialogWrapper>
                )}
            </AnimatePresence>

            {/* ================= VERIFY EMAIL DIALOG ================= */}

            <AnimatePresence>
                {openVerifyDialog && (
                    <DialogWrapper>
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20,
                            }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-[410px] overflow-hidden rounded-[26px] border border-gray-200 bg-white shadow-2xl"
                        >
                            {/* Header */}
                            <div className="border-b border-gray-100 bg-white px-5 py-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 text-gray-700">
                                            <Mail size={20} />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Verify Email
                                            </h2>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Verify your identity with OTP
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setOpenVerifyDialog(false)
                                        }
                                        className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-5">
                                <div className="space-y-4">
                                    {error && <p className="text-red-500 text-sm">{error}</p>}
                                    {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
                                    
                                    <InputField
                                        icon={<Mail size={18} />}
                                        type="email"
                                        placeholder="Email Address"
                                    />

                                    {otpSent && (
                                        <InputField
                                            icon={
                                                <ShieldCheck size={18} />
                                            }
                                            type="text"
                                            placeholder="Enter OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    )}
                                </div>

                                {/* OTP SECTION */}
                                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                                    {!otpSent ? (
                                        <motion.button
                                            whileHover={{
                                                scale: 1.01,
                                            }}
                                            whileTap={{
                                                scale: 0.98,
                                            }}
                                            onClick={handleSendOTP}
                                            className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                        >
                                            Send OTP
                                        </motion.button>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-gray-600">
                                                Resend OTP in{" "}
                                                <span className="font-semibold text-gray-900">
                                                    {timer}s
                                                </span>
                                            </span>

                                            <button
                                                disabled={timer > 0}
                                                onClick={handleSendOTP}
                                                className={`text-xs font-semibold transition ${timer > 0
                                                    ? "cursor-not-allowed text-gray-400"
                                                    : "text-gray-900 hover:text-black"
                                                    }`}
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="mt-5 flex gap-3">
                                    <motion.button
                                        whileHover={{
                                            scale: 1.01,
                                        }}
                                        whileTap={{
                                            scale: 0.98,
                                        }}
                                        onClick={() => {
                                            setOpenVerifyDialog(false);
                                            setOpenPasswordDialog(true);
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                    >
                                        <ArrowLeft size={16} />
                                        Back
                                    </motion.button>

                                    {otpSent && (
                                        <motion.button
                                            whileHover={{
                                                scale: 1.01,
                                            }}
                                            whileTap={{
                                                scale: 0.98,
                                            }}
                                            onClick={handleChangePassword}
                                            className="flex-1 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black"
                                        >
                                            Change Password
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </DialogWrapper>
                )}
            </AnimatePresence>
        </>
    );
};

/* ================= DIALOG WRAPPER ================= */

const DialogWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
        >
            {children}
        </motion.div>
    );
};

/* ================= INPUT FIELD ================= */

const InputField = ({
    icon,
    type,
    placeholder,
    eye,
    show,
    toggle,
    value,
    onChange,
}) => {
    return (
        <div className="group rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all duration-300 focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm">
            <div className="flex items-center gap-3">
                <div className="text-gray-400 transition group-focus-within:text-gray-700">
                    {icon}
                </div>

                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-transparent text-sm font-medium text-gray-800 placeholder:text-gray-400 outline-none"
                />

                {eye && (
                    <button
                        type="button"
                        onClick={toggle}
                        className="text-gray-400 transition hover:text-gray-700"
                    >
                        {show ? (
                            <EyeOff size={18} />
                        ) : (
                            <Eye size={18} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChangePasswordCard;