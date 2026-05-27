import React from "react";
import { Moon } from "lucide-react";
import { motion } from "framer-motion";

const HibernateAccountCard = () => {
    return (
        <motion.div
            whileHover={{
                y: -4,
            }}
            className="flex flex-col gap-5 rounded-3xl border border-yellow-100 bg-yellow-50/70 p-6 transition-all duration-300 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
        >
            <div className="flex items-start gap-4">
                <motion.div
                    whileHover={{
                        rotate: 8,
                    }}
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
                whileHover={{
                    scale: 1.05,
                }}
                whileTap={{
                    scale: 0.96,
                }}
                className="rounded-2xl border border-yellow-200 bg-white px-6 py-3 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
            >
                Hibernate
            </motion.button>
        </motion.div>
    );
};

export default HibernateAccountCard;