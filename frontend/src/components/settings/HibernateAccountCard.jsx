import React, { useState } from "react";
import { Moon, EyeOff, BellOff, MessageSquare, RefreshCw, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../store/authStore";

const HibernateAccountCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleHibernate = async () => {
        if (!password) {
            toast.error("Please enter your password to confirm.");
            return;
        }

        try {
            setLoading(true);
            
            await api.post("/auth/hibernate", { password });

            toast.success("Account hibernated successfully. Logging you out...");
            
            // Clear local storage and redirect
            logout();
            setTimeout(() => {
                navigate("/");
            }, 1500);
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to hibernate account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -4 }}
                className="flex flex-col gap-5 rounded-3xl border border-yellow-100 bg-yellow-50/70 p-6 transition-all duration-300 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
            >
                <div className="flex items-start gap-4">
                    <motion.div
                        whileHover={{ rotate: 8 }}
                        className="rounded-2xl bg-yellow-100 p-3 text-yellow-700"
                    >
                        <Moon size={22} />
                    </motion.div>

                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Hibernate Account
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                            Temporarily disable your profile and hide your activity.
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-2xl border border-yellow-200 bg-white px-6 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
                >
                    Hibernate
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl"
                        >
                            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <Moon size={20} />
                                    <h3 className="font-bold text-gray-900">Hibernate Account</h3>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="p-6">
                                <p className="mb-4 text-sm font-medium text-gray-700">
                                    Your account will be temporarily hidden. While hibernated:
                                </p>
                                
                                <ul className="mb-6 space-y-3 text-sm text-gray-600">
                                    <li className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600"><EyeOff size={16} /></div>
                                        <span>Profile becomes invisible</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600"><BellOff size={16} /></div>
                                        <span>Notifications paused</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600"><MessageSquare size={16} /></div>
                                        <span>Messages preserved</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600"><RefreshCw size={16} /></div>
                                        <span>You can reactivate anytime</span>
                                    </li>
                                </ul>

                                <div className="mb-6 rounded-xl bg-yellow-50 p-4 text-sm text-yellow-800 flex items-start gap-3">
                                    <ShieldAlert size={20} className="shrink-0 mt-0.5" />
                                    <p>We will keep your data safe for 90 days. Reactivate by logging in again.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-500/10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleHibernate}
                                    disabled={loading || !password}
                                    className="flex-1 rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-50"
                                >
                                    {loading ? "Hibernating..." : "Hibernate Now"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default HibernateAccountCard;