import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({
    label,
    name,
    type = "text",
    placeholder,
    value,
    onChange,
    required = true,
    icon: Icon,
    isPassword = false,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className="w-full text-left">
            {/* High-contrast Label */}
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                {label}
            </label>

            <div className="relative rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.04)]">
                {/* Left Icon */}
                {Icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                        <Icon size={18} strokeWidth={2.2} />
                    </div>
                )}

                {/* Input: Crisp border and dark readable text */}
                <input
                    type={inputType}
                    name={name}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border-2 border-slate-300 bg-white py-3 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none transition-all duration-150
            ${Icon ? "pl-11" : "pl-4"}
            ${isPassword ? "pr-11" : "pr-4"}
            focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 shadow-sm hover:border-slate-400`}
                />

                {/* Eye Toggle for Passwords */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                        aria-label="Toggle password visibility"
                    >
                        {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                )}
            </div>
        </div>
    );
}