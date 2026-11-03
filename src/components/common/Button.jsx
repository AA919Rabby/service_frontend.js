import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
    children,
    type = "button",
    variant = "primary",
    loading = false,
    onClick,
    className = "",
}) {
    const baseStyles =
        "w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer select-none active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        // 3D Primary Button with bottom bevel shadow
        primary:
            "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_5px_0_#4338ca,0_10px_20px_rgba(79,70,229,0.3)] active:shadow-[0_2px_0_#4338ca]",

        // 3D White Outline Button (for Google / Socials)
        secondary:
            "bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 shadow-[0_4px_0_#cbd5e1] active:shadow-[0_1px_0_#cbd5e1]",
    };

    return (
        <button
            type={type}
            disabled={loading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
}