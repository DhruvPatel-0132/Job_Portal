import React, { useState } from "react";

import {
    ShieldCheck,
    Lock,
    KeyRound,
    UserCog,
    Moon,
    Trash2,
    BadgeCheck,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import MenuItem from "../components/settings/MenuItem";
import SecurityCard from "../components/settings/SecurityCard";

import ChangePasswordCard from "../components/settings/ChangePasswordCard";
import HibernateAccountCard from "../components/settings/HibernateAccountCard";
import DeleteAccountCard from "../components/settings/DeleteAccountCard";

const SettingsPrivacy = () => {
    const [activeSection, setActiveSection] =
        useState("Security");

    /* =========================
       Sidebar Menu
    ========================= */

    const menuItems = [
        {
            title: "Security",
            desc: "Passwords & authentication",
        },
        {
            title: "Account Management",
            desc: "Hibernate or delete account",
        },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-gray-100 blur-3xl"
                />

                <motion.div
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-gray-100 blur-3xl"
                />
            </div>

            {/* Header */}
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="sticky top-0 z-20 border-b border-gray-100 bg-white/80 backdrop-blur-xl"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <motion.div
                                whileHover={{
                                    rotate: 8,
                                    scale: 1.08,
                                }}
                                className="rounded-full bg-gray-100 p-1.5 text-gray-700"
                            >
                                <ShieldCheck size={14} />
                            </motion.div>

                            <span className="text-xs font-medium text-gray-500">
                                Account Center
                            </span>
                        </div>

                        <h1 className="text-2xl font-black tracking-tight text-gray-900">
                            Settings & Privacy
                        </h1>
                    </div>
                </div>
            </motion.div>

            {/* Main Layout */}
            <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-4">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-fit rounded-[32px] border border-gray-100 bg-white p-5 shadow-sm"
                >
                    <div className="mb-7">
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                rotate: 4,
                            }}
                            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-700"
                        >
                            <BadgeCheck size={22} />
                        </motion.div>

                        <h2 className="text-lg font-bold text-gray-900">
                            Quick Settings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Navigate through your account controls.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {menuItems.map((item, index) => (
                            <MenuItem
                                key={index}
                                item={item}
                                activeSection={activeSection}
                                setActiveSection={setActiveSection}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="space-y-8 lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {/* Security */}
                        {activeSection === "Security" && (
                            <motion.div
                                key="security"
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20,
                                }}
                                transition={{
                                    duration: 0.35,
                                }}
                                className="overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-sm"
                            >
                                {/* Header */}
                                <div className="relative overflow-hidden border-b border-gray-100 px-7 py-6">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 6,
                                            repeat: Infinity,
                                        }}
                                        className="absolute right-0 top-0 h-32 w-32 rounded-full bg-gray-100 blur-3xl"
                                    />

                                    <div className="relative flex items-center gap-5">
                                        <motion.div
                                            whileHover={{
                                                rotate: 6,
                                                scale: 1.05,
                                            }}
                                            className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gray-100 text-gray-700"
                                        >
                                            <Lock size={26} />
                                        </motion.div>

                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">
                                                Security
                                            </h2>

                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                Manage authentication and account
                                                protection settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cards */}
                                <div className="grid gap-5 p-6 md:grid-cols-2">
                                    <ChangePasswordCard />

                                    {/* Reusable Example */}
                                    {/* <SecurityCard
                                        icon={<KeyRound size={20} />}
                                        title="Two Factor Authentication"
                                        desc="Add an additional layer of security to your account."
                                    /> */}
                                </div>
                            </motion.div>
                        )}

                        {/* Account Management */}
                        {activeSection ===
                            "Account Management" && (
                            <motion.div
                                key="account"
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -20,
                                }}
                                transition={{
                                    duration: 0.35,
                                }}
                                className="overflow-hidden rounded-[36px] border border-gray-100 bg-white shadow-sm"
                            >
                                {/* Header */}
                                <div className="border-b border-gray-100 px-7 py-6">
                                    <div className="flex items-center gap-5">
                                        <motion.div
                                            whileHover={{
                                                rotate: 6,
                                                scale: 1.05,
                                            }}
                                            className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gray-100 text-gray-700"
                                        >
                                            <UserCog size={26} />
                                        </motion.div>

                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900">
                                                Account Management
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Manage temporary account actions or
                                                permanent deletion.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-5 p-6">
                                    <HibernateAccountCard />

                                    <DeleteAccountCard />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SettingsPrivacy;