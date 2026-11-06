// import React from "react";
// import { Check } from "lucide-react";

// export default function Dialog({
//     isOpen,
//     title = "Account Registered!",
//     message = "Your account with TN Services has been created and verified successfully. You can now log in to access all features.",
//     buttonText = "Go to Sign In",
//     onConfirm,
// }) {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
//             {/* Dark Glassmorphic Dialog Container */}
//             <div className="relative w-full max-w-sm sm:max-w-md p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_80px_rgba(3,7,18,0.95),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-all duration-300">
//                 <div className="w-full h-full bg-[#0b0f19]/95 rounded-[2.45rem] p-7 sm:p-10 border border-slate-700/40 relative overflow-hidden flex flex-col items-center text-center">

//                     {/* Ambient Glows */}
//                     <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
//                     <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

//                     {/* Centered 3D Emerald Checkmark Badge */}
//                     <div className="relative mb-6 z-10">
//                         <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-[0_0_30px_rgba(16,185,129,0.35),inset_0_2px_4px_rgba(255,255,255,0.6)] border-4 border-emerald-950/50">
//                             <Check size={38} strokeWidth={3} className="drop-shadow-sm" />
//                         </div>
//                         {/* Subtle Outer Glow Ring */}
//                         <div className="pointer-events-none absolute -inset-2 rounded-full border border-emerald-500/30 animate-pulse" />
//                     </div>

//                     {/* Title */}
//                     <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5 z-10">
//                         {title}
//                     </h3>

//                     {/* Message */}
//                     <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-xs mb-8 z-10">
//                         {message}
//                     </p>

//                     {/* Action Button */}
//                     <div className="w-full z-10">
//                         <button
//                             type="button"
//                             onClick={onConfirm}
//                             className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
//                         >
//                             {buttonText}
//                         </button>
//                     </div>

//                     {/* Attribution */}
//                     <p className="mt-6 text-[11px] font-semibold text-slate-500 z-10">
//                         TN Services • Platform by <span className="text-slate-300 font-bold">Md Rabbi</span>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// }



import React from "react";
import { Check } from "lucide-react";

export default function Dialog({
    isOpen,
    title = "Account Registered!",
    message = "Your account with TN Services has been created and verified successfully. You can now log in to access all features.",
    buttonText = "Go to Sign In",
    onConfirm,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm sm:max-w-md p-[1.5px] rounded-[2.5rem] bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-500 shadow-[0_20px_70px_rgba(59,130,246,0.2)] transition-all duration-300">
                <div className="w-full h-full bg-white rounded-[2.4rem] p-7 sm:p-10 border border-white relative overflow-hidden flex flex-col items-center text-center">

                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative mb-6 z-10">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)] border-4 border-emerald-100">
                            <Check size={38} strokeWidth={3} className="drop-shadow-sm" />
                        </div>
                        <div className="pointer-events-none absolute -inset-2 rounded-full border border-emerald-400/40 animate-pulse" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2.5 z-10">
                        {title}
                    </h3>

                    <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-xs mb-8 z-10">
                        {message}
                    </p>

                    <div className="w-full z-10">
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_8px_25px_rgba(79,70,229,0.3)] hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] transition-all cursor-pointer"
                        >
                            {buttonText}
                        </button>
                    </div>

                    <p className="mt-6 text-[11px] font-semibold text-slate-500 z-10">
                        TN Services • Platform by <span className="text-indigo-600 font-bold">Md Rabbi</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
