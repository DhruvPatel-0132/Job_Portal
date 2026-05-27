import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SecurityCard = ({
    icon,
    title,
    desc,
    onClick,
}) => {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{
                y: -6,
                scale: 1.02,
            }}
            whileTap={{
                scale: 0.98,
            }}
            className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-5 text-left transition-all duration-300 hover:border-gray-200 hover:shadow-xl"
        >
            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute -left-20 top-0 h-full w-20 rotate-12 bg-white/70 blur-xl transition-all duration-700 group-hover:left-[120%]" />
            </div>

            <div className="relative mb-5 flex items-start justify-between">
                <motion.div
                    whileHover={{
                        rotate: 8,
                    }}
                    className="rounded-2xl bg-gray-100 p-3 text-gray-700"
                >
                    {icon}
                </motion.div>
            </div>

            <h3 className="relative text-lg font-bold text-gray-900">
                {title}
            </h3>

            <p className="relative mt-2 text-sm leading-relaxed text-gray-500">
                {desc}
            </p>

            <motion.div
                whileHover={{ x: 4 }}
                className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
                Manage
                <ChevronRight size={16} />
            </motion.div>
        </motion.button>
    );
};

export default SecurityCard;