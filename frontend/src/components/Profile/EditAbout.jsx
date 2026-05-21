// import { motion, AnimatePresence } from "framer-motion";
// import { useState } from "react";
// import { X, CheckCircle2, FileText } from "lucide-react";

// export default function EditAbout({ isOpen, setIsOpen, aboutText, setAboutText, onSave }) {
//   const [isSaving, setIsSaving] = useState(false);

//   const handleSave = async () => {
//     setIsSaving(true);
//     if (onSave) {
//       await onSave(aboutText);
//     }
//     setIsSaving(false);
//     setIsOpen(false);
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
//           {/* Backdrop */}
//           <motion.div
//             className="absolute inset-0 bg-black/20 backdrop-blur-sm"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsOpen(false)}
//           />

//           {/* Modal Container */}
//           <motion.div
//             className="relative z-10 w-full max-w-2xl bg-white rounded-[24px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100"
//             initial={{ opacity: 0, scale: 0.96, y: 20 }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.96, y: 20 }}
//             transition={{ type: "spring", bounce: 0, duration: 0.4 }}
//             onClick={(e) => e.stopPropagation()}
//             style={{ maxHeight: "calc(100vh - 40px)" }}
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
//                   <FileText size={20} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Edit About</h3>
//                   <p className="text-[13px] text-gray-500 mt-0.5">Write a brief summary of your professional background.</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* Form Area */}
//             <div className="flex-1 overflow-y-auto p-8">
//               <div className="flex flex-col gap-2">
//                 <label className="text-[13px] font-medium text-gray-700">
//                   Summary
//                 </label>
//                 <textarea
//                   value={aboutText}
//                   onChange={(e) => setAboutText(e.target.value)}
//                   placeholder="e.g., I'm a full stack developer..."
//                   rows={8}
//                   className="w-full rounded-xl border border-gray-200/80 bg-white
//                              px-4 py-3 text-[15px] text-gray-900 shadow-[0_2px_4px_rgba(0,0,0,0.02)]
//                              focus:border-black focus:ring-1 focus:ring-black outline-none transition-all duration-200
//                              hover:border-gray-300 placeholder:text-gray-400 resize-none"
//                 />
//                 <div className="flex justify-between items-center mt-1">
//                   <p className="text-[12px] text-gray-400">
//                     You can use up to 2,000 characters.
//                   </p>
//                   <p className={`text-[12px] font-medium ${(aboutText?.length || 0) > 2000 ? 'text-red-500' : 'text-gray-400'}`}>
//                     {aboutText?.length || 0} / 2000
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="px-5 py-2.5 text-[14px] font-medium text-gray-600 rounded-xl hover:bg-gray-200/50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={isSaving || (aboutText?.length || 0) > 2000}
//                 className="relative px-6 py-2.5 text-[14px] font-medium text-white bg-black rounded-xl overflow-hidden shadow-md shadow-black/10 hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
//               >
//                 <div className="flex items-center gap-2">
//                   {isSaving ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       Save Changes
//                       <CheckCircle2 size={16} className="opacity-80" />
//                     </>
//                   )}
//                 </div>
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </AnimatePresence>
//   );
// }
