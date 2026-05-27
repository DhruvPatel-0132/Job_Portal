import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * A reusable, custom alert dialog component.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the dialog is visible.
 * @param {Function} props.onClose - Function to call when the dialog is dismissed or canceled.
 * @param {Function} props.onConfirm - Function to call when the confirm action is triggered.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.description - The descriptive text explaining the action.
 * @param {string} [props.confirmText="Yes"] - Text for the confirm button.
 * @param {string} [props.cancelText="No"] - Text for the cancel button.
 * @param {"danger" | "primary"} [props.type="primary"] - Determines the style of the confirm button.
 * @param {boolean} [props.isLoading=false] - Whether the confirm action is currently loading.
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Yes",
  cancelText = "No",
  type = "primary",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative bg-white w-full max-w-[400px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 bg-[#f8f9fa]">
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              {description}
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2 rounded-xl text-sm font-semibold text-white shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2 ${
                type === "danger"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#0a66c2] hover:bg-[#004182]"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {confirmText}...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
