import React from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const MenuItem = ({
    item,
    activeSection,
    setActiveSection,
}) => {
    const isActive = activeSection === item.title;

    return (
        <motion.button
            onClick={() => setActiveSection(item.title)}
            whileHover={{
                y: -3,
                scale: 1.01,
            }}
            whileTap={{
                scale: 0.98,
            }}
            className={`group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                isActive
                    ? "border-gray-200 bg-gray-100 shadow-sm"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white hover:shadow-md"
            }`}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white to-gray-100"
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                />
            )}

            <div className="relative flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-gray-900">
                        {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        {item.desc}
                    </p>
                </div>

                <motion.div
                    animate={{
                        x: isActive ? 4 : 0,
                    }}
                >
                    <ChevronRight
                        size={18}
                        className="text-gray-400"
                    />
                </motion.div>
            </div>
        </motion.button>
    );
};

export default MenuItem;