import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShieldCheck,
    Eye,
    EyeOff
} from "lucide-react";
import {
    forgotPasswordApi,
    verifyResetOtpApi,
    resetPasswordApi,
    getErrorMessage
} from "../api/authApi";

export default function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [forgotToken, setForgotToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [resendStatus, setResendStatus] = useState("");

    // Loading States
    const [isSendOtpLoading, setIsSendOtpLoading] = useState(false);
    const [isVerifyOtpLoading, setIsVerifyOtpLoading] = useState(false);
    const [isResetPassLoading, setIsResetPassLoading] = useState(false);
    const [isResendLoading, setIsResendLoading] = useState(false);

    // Global Action Lock
    const isAnyLoading = isSendOtpLoading || isVerifyOtpLoading || isResetPassLoading || isResendLoading;

    // --- Step 1: Send Forgot Password OTP ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (isAnyLoading) return;

        if (!email) {
            setErrorMessage("Please enter your registered email address.");
            return;
        }

        setErrorMessage("");
        setIsSendOtpLoading(true);

        try {
            await forgotPasswordApi({ email });
            setCurrentStep(2);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsSendOtpLoading(false);
        }
    };

    // --- Step 2: Handle OTP auto-jump ---
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value !== "" && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    // --- Step 2: Verify Reset OTP ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (isAnyLoading) return;

        const enteredOtp = otp.join("");
        if (enteredOtp.length < 6) {
            setErrorMessage("Please enter all 6 digits of the verification code.");
            return;
        }

        setErrorMessage("");
        setIsVerifyOtpLoading(true);

        try {
            const response = await verifyResetOtpApi({ otp: enteredOtp });

            const token = response?.forgotToken || response?.data?.forgotToken || enteredOtp;
            setForgotToken(token);

            setCurrentStep(3);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsVerifyOtpLoading(false);
        }
    };

    // --- Resend OTP ---
    const handleResendOtp = async () => {
        if (isAnyLoading) return;

        setErrorMessage("");
        setIsResendLoading(true);
        setResendStatus("Resending code...");

        try {
            await forgotPasswordApi({ email });

            setOtp(["", "", "", "", "", ""]);
            setResendStatus("New verification OTP sent to your email!");
            setTimeout(() => setResendStatus(""), 4000);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            setResendStatus("");
        } finally {
            setIsResendLoading(false);
        }
    };

    // --- Step 3: Reset Password ---
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (isAnyLoading) return;

        if (newPassword.length < 8) {
            setErrorMessage("Password must be at least 8 characters.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        setErrorMessage("");
        setIsResetPassLoading(true);

        try {
            await resetPasswordApi({
                forgotToken,
                newPassword,
            });

            setCurrentStep(4);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsResetPassLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-indigo-500 selection:text-white overflow-hidden text-slate-100">
            {/* Ambient Lighting Gradients (Static, No Canvas Animation) */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-indigo-600/10 via-blue-700/5 to-transparent blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-700/10 via-indigo-600/5 to-transparent blur-[140px] pointer-events-none" />

            {/* 🌟 Same Dark Glassmorphic Card Container as Login & Register */}
            <div className="relative z-10 w-full max-w-lg p-[1px] rounded-[2.5rem] bg-gradient-to-b from-slate-600/30 via-slate-700/15 to-slate-900/60 shadow-[0_0_80px_rgba(3,7,18,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl transition-all duration-300">
                <div className="w-full h-full bg-[#0b0f19]/90 rounded-[2.45rem] p-7 sm:p-10 border border-slate-700/40 relative overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="text-center mb-6 relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-400 text-xs font-bold tracking-wide uppercase mb-3 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <Sparkles size={14} className="text-indigo-400" />
                            <span>Account Recovery</span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            {currentStep === 1 && "Reset Password"}
                            {currentStep === 2 && "Verification Code"}
                            {currentStep === 3 && "Set New Password"}
                            {currentStep === 4 && "Password Updated!"}
                        </h1>
                        <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                            {currentStep === 1 && "We'll send an OTP code to your registered email"}
                            {currentStep === 2 && `Enter the 6-digit code sent to ${email}`}
                            {currentStep === 3 && "Create a secure new password for your account"}
                            {currentStep === 4 && "Your account is secure. You can now log in."}
                        </p>
                    </div>

                    {/* Step Indicators */}
                    {currentStep < 4 && (
                        <div className="flex items-center justify-center gap-2 mb-6 relative z-10">
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 1 ? "w-10 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "w-5 bg-slate-800"}`} />
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 2 ? "w-10 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "w-5 bg-slate-800"}`} />
                            <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= 3 ? "w-10 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" : "w-5 bg-slate-800"}`} />
                        </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 relative z-10 animate-in fade-in duration-200">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Resend Status */}
                    {resendStatus && (
                        <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center relative z-10">
                            {resendStatus}
                        </div>
                    )}

                    {/* STEP 1: ENTER EMAIL */}
                    {currentStep === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-4 relative z-10">
                            <div>
                                <label htmlFor="forgot-email" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                                    Account Email Address
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <Mail size={17} />
                                    </span>
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        required
                                        disabled={isAnyLoading}
                                        placeholder="you@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full py-3.5 pl-11 pr-4 rounded-2xl bg-slate-900/70 text-white text-xs font-semibold outline-none border border-slate-700/60 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-500 shadow-inner"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isAnyLoading}
                                className={`w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer ${isAnyLoading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isSendOtpLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Send Verification OTP"
                                )}
                            </button>
                        </form>
                    )}

                    {/* STEP 2: VERIFY OTP */}
                    {currentStep === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5 relative z-10">
                            <div className="flex justify-between gap-2 sm:gap-3">
                                {otp.map((data, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength="1"
                                        disabled={isAnyLoading}
                                        value={data}
                                        onChange={(e) => handleOtpChange(e.target, index)}
                                        onFocus={(e) => e.target.select()}
                                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-black text-white rounded-xl bg-slate-900/80 border border-slate-700 focus:border-indigo-400 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-400/30 outline-none transition disabled:opacity-50"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isAnyLoading}
                                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer ${isAnyLoading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isVerifyOtpLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Confirm Code"
                                )}
                            </button>

                            <div className="text-center text-xs text-slate-400">
                                Didn't receive code?{" "}
                                <button
                                    type="button"
                                    disabled={isAnyLoading}
                                    onClick={handleResendOtp}
                                    className={`font-bold text-indigo-400 hover:underline cursor-pointer inline-flex items-center gap-1 ${isAnyLoading ? "opacity-50 pointer-events-none" : ""
                                        }`}
                                >
                                    {isResendLoading && <Loader2 size={12} className="animate-spin" />}
                                    <span>Resend OTP</span>
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: RESET PASSWORDS */}
                    {currentStep === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4 relative z-10">
                            <div>
                                <label htmlFor="new-password" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                                    New Password
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <Lock size={17} />
                                    </span>
                                    <input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        required
                                        disabled={isAnyLoading}
                                        placeholder="At least 8 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full py-3.5 pl-11 pr-11 rounded-2xl bg-slate-900/70 text-white text-xs font-semibold outline-none border border-slate-700/60 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-500 shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-slate-200 transition"
                                    >
                                        {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-new-password" className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 ml-1">
                                    Confirm New Password
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-slate-400">
                                        <Lock size={17} />
                                    </span>
                                    <input
                                        id="confirm-new-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        disabled={isAnyLoading}
                                        placeholder="Repeat your new password"
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        className="w-full py-3.5 pl-11 pr-11 rounded-2xl bg-slate-900/70 text-white text-xs font-semibold outline-none border border-slate-700/60 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all placeholder:text-slate-500 shadow-inner"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 text-slate-400 hover:text-slate-200 transition"
                                    >
                                        {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isAnyLoading}
                                className={`w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer ${isAnyLoading ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isResetPassLoading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {currentStep === 4 && (
                        <div className="text-center space-y-5 py-4 relative z-10">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
                                <CheckCircle2 size={36} />
                            </div>

                            <p className="text-sm font-semibold text-slate-300">
                                Your password has been reset securely. You can now sign in with your new credentials.
                            </p>

                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-all cursor-pointer"
                            >
                                Go to Sign In
                            </button>
                        </div>
                    )}

                    {/* Back to Sign In Link */}
                    <div className="mt-7 text-center relative z-10">
                        <Link
                            to={isAnyLoading ? "#" : "/login"}
                            className={`inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition ${isAnyLoading ? "opacity-50 pointer-events-none" : ""
                                }`}
                        >
                            <ArrowLeft size={14} />
                            <span>Back to Sign In</span>
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>256-Bit TLS Recovery</span>
                        </div>
                        <div>
                            TN Services • Built by <span className="font-bold text-slate-200">Md Rabbi</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}