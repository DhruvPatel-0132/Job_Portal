import React from "react";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const DeleteAccountCard = () => {
    return (
        <motion.div
            whileHover={{
                y: -4,
            }}
            className="flex flex-col gap-5 rounded-3xl border border-red-100 bg-red-50/70 p-6 transition-all duration-300 hover:shadow-lg lg:flex-row lg:items-center lg:justify-between"
        >
            <div className="flex items-start gap-4">
                <motion.div
                    whileHover={{
                        rotate: 8,
                    }}
                    className="rounded-2xl bg-red-100 p-3 text-red-600"
                >
                    <Trash2 size={22} />
                </motion.div>

                <div>
                    <h3 className="text-lg font-bold text-red-600">
                        Delete Account
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                        Permanently remove your account and all associated
                        data.
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
                className="rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
                Delete Account
            </motion.button>
        </motion.div>
    );
};

export default DeleteAccountCard;